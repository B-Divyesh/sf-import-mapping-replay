import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

test('@claim:demo-errors sample replay catches three source errors', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Review a finished CSV replay');
  await expect(page.getByText('3', { exact: true })).toBeVisible();
  await expect(page.locator('.issue-table tbody tr')).toHaveCount(3);
  await expect(page.getByText('not-an-email', { exact: true })).toBeVisible();
  await expect(page.getByText('C-1043', { exact: true })).toBeVisible();
  await expect(page.getByText('legacy', { exact: true })).toBeVisible();
});

test('@claim:review-files sample produces all four review files', async ({ page }) => {
  await page.goto('/demo');
  for (const file of ['output.csv', 'evidence.json', 'validation.json', 'rollback-manifest.json']) {
    await expect(page.getByText(file, { exact: true })).toBeVisible();
  }
});

test('@claim:demo-private demo stores nothing and sends no data away', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.addInitScript(() => localStorage.setItem('sb_license:import-mapping-replay', 'real-license-sentinel'));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  expect(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)))).toEqual({ 'sb_license:import-mapping-replay': 'real-license-sentinel' });
  expect(requests.every(url => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:cli-offline @claim:demo-temp CLI replays bundled data without a service or account', async () => {
  const output = execFileSync(resolve('target/debug/import-mapping-replay'), ['demo', '--json'], {
    encoding: 'utf8',
    env: { ...process.env, HTTP_PROXY: 'http://127.0.0.1:1', HTTPS_PROXY: 'http://127.0.0.1:1', NO_PROXY: '' },
  });
  const result = JSON.parse(output);
  expect(result.rows).toBe(5);
  expect(result.validation_errors).toBe(3);
  expect(result.demo_directory).toContain('import-mapping-replay-demo-');
  expect(readFileSync(result.output_csv, 'utf8')).toContain('maya.rivera@northstar.example');
});

test('@claim:cli-replay @claim:mapping-v1 @claim:source-unchanged @claim:json-output CLI writes deterministic transformed output and manifests', async () => {
  const out = mkdtempSync(join(tmpdir(), 'replay-claim-'));
  const source = resolve('examples/valid-customers.csv');
  const before = readFileSync(source);
  const stdout = execFileSync(resolve('target/debug/import-mapping-replay'), [
    'run', '--source', resolve('examples/valid-customers.csv'), '--mapping', resolve('examples/mapping.json'), '--out-dir', out, '--json',
  ], { encoding: 'utf8' });
  expect(JSON.parse(stdout)).toMatchObject({ status: 'valid', rows: 3, validation_errors: 0 });
  expect(readFileSync(join(out, 'output.csv'), 'utf8')).toContain('C-1042,maya@northstar.example,2025-04-18,growth');
  expect(JSON.parse(readFileSync(join(out, 'evidence.json'), 'utf8')).fields).toHaveLength(12);
  expect(JSON.parse(readFileSync(join(out, 'rollback-manifest.json'), 'utf8')).rows).toHaveLength(3);
  expect(readFileSync(source)).toEqual(before);
  const second = mkdtempSync(join(tmpdir(), 'replay-claim-'));
  execFileSync(resolve('target/debug/import-mapping-replay'), ['run', '--source', source, '--mapping', resolve('examples/mapping.json'), '--out-dir', second]);
  expect(readFileSync(join(second, 'evidence.json'))).toEqual(readFileSync(join(out, 'evidence.json')));

  const rulesRoot = mkdtempSync(join(tmpdir(), 'replay-rules-'));
  const rulesSource = join(rulesRoot, 'source.csv');
  const rulesMapping = join(rulesRoot, 'mapping.json');
  writeFileSync(rulesSource, 'A,B,C,D,E,F\n x ,HELLO,old,04/18/2025,,\n');
  writeFileSync(rulesMapping, JSON.stringify({ version: 1, fields: [
    { target: 'trim_upper', source: 'A', transforms: [{ op: 'trim' }, { op: 'uppercase' }], validate: [{ rule: 'required' }] },
    { target: 'lower', source: 'B', transforms: [{ op: 'lowercase' }] },
    { target: 'replaced', source: 'C', transforms: [{ op: 'replace', from: 'old', to: 'new' }], validate: [{ rule: 'one_of', values: ['new'] }] },
    { target: 'date', source: 'D', transforms: [{ op: 'date', input: '%m/%d/%Y', output: '%Y-%m-%d' }] },
    { target: 'defaulted', source: 'E', default: 'fallback', validate: [{ rule: 'required' }] },
    { target: 'missing', source: 'F', validate: [{ rule: 'required' }] },
  ] }));
  const rulesResult = spawnSync(resolve('target/debug/import-mapping-replay'), ['run', '--source', rulesSource, '--mapping', rulesMapping, '--out-dir', join(rulesRoot, 'out')]);
  expect(rulesResult.status).toBe(2);
  expect(readFileSync(join(rulesRoot, 'out/output.csv'), 'utf8')).toContain('X,hello,new,2025-04-18,fallback');
  expect(JSON.parse(readFileSync(join(rulesRoot, 'out/validation.json'), 'utf8')).issues[0].rule).toBe('required');
});

test('@claim:paid-kit @claim:license-privacy license verification reveals the £24 team kit download', async ({ page }) => {
  let verifyUrl = '';
  await page.route('https://api.sociobot.in/**', route => {
    verifyUrl = route.request().url();
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) });
  });
  await page.goto('/');
  await expect(page.getByText('£24', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Buy the team kit/ })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/import-mapping-replay/checkout');
  await page.getByLabel('Have a license? Paste it here').fill('test-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('License active. The team kit is ready.')).toBeVisible();
  expect(verifyUrl).toBe('https://api.sociobot.in/api/v1/products/import-mapping-replay/verify?license=test-license');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:import-mapping-replay'))).toBe('test-license');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download team kit' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('import-mapping-replay-team-kit.json');
  const path = await download.path();
  const kit = JSON.parse(readFileSync(path!, 'utf8'));
  expect(kit.recipes).toHaveLength(5);
  expect(kit.review).toHaveLength(4);
});

test('@claim:actionable-errors invalid input exits non-zero and names the next step', async () => {
  const root = mkdtempSync(join(tmpdir(), 'replay-error-'));
  const source = join(root, 'bad.csv');
  writeFileSync(source, 'Other\nvalue\n');
  const result = spawnSync(resolve('target/debug/import-mapping-replay'), ['run', '--source', source, '--mapping', resolve('examples/mapping.json'), '--out-dir', join(root, 'out')], { encoding: 'utf8' });
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('check the CSV header or mapping');
});

test('pages have one h1, keyboard focus, and no serious accessibility errors', async ({ page }) => {
  for (const path of ['/', '/demo', '/privacy', '/terms', '/missing-route']) {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeFocused();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(item => ['critical', 'serious'].includes(item.impact || ''))).toEqual([]);
  }
});

test('navigation, back button, reset, and terminal recording work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole('button', { name: 'Replay recording' }).click();
  await expect(page.locator('#terminal-output')).toContainText('Replay complete', { timeout: 3_000 });
});
