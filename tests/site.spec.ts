import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const checkoutUrl = 'https://api.sociobot.in/api/v1/products/import-mapping-replay/checkout';

function runBundledDemo(): Record<string, string | number> {
  return JSON.parse(execFileSync(resolve('target/debug/import-mapping-replay'), ['demo', '--json'], { encoding: 'utf8' }));
}

function networkGuard(root: string): { library: string; log: string } {
  const library = join(root, 'network-guard.so');
  const log = join(root, 'network.log');
  execFileSync('cc', ['-shared', '-fPIC', resolve('tests/network_guard.c'), '-o', library]);
  return { library, log };
}

test('@claim:demo-errors sample replay catches three source errors', async ({ page }) => {
  const result = runBundledDemo();
  expect(result.validation_errors).toBe(3);
  const validation = JSON.parse(readFileSync(String(result.validation), 'utf8'));
  expect(validation.issues).toEqual(expect.arrayContaining([
    expect.objectContaining({ source_row: 5, field: 'email', value: 'not-an-email' }),
    expect.objectContaining({ source_row: 6, field: 'external_id', value: 'C-1043' }),
    expect.objectContaining({ source_row: 6, field: 'plan', value: 'legacy' }),
  ]));
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Review a finished CSV replay');
  await expect(page.getByText('3', { exact: true })).toBeVisible();
  await expect(page.locator('.issue-table tbody tr')).toHaveCount(3);
  await expect(page.getByText('not-an-email', { exact: true })).toBeVisible();
  await expect(page.getByText('C-1043', { exact: true })).toBeVisible();
  await expect(page.getByText('legacy', { exact: true })).toBeVisible();
});

test('@claim:review-files sample produces all four review files', async ({ page }) => {
  const result = runBundledDemo();
  for (const path of [result.output_csv, result.evidence, result.validation, result.rollback_manifest]) {
    expect(existsSync(String(path))).toBe(true);
    expect(readFileSync(String(path), 'utf8').trim()).not.toBe('');
  }
  await page.goto('/demo');
  for (const file of ['output.csv', 'evidence.json', 'validation.json', 'rollback-manifest.json']) {
    await expect(page.getByText(file, { exact: true })).toBeVisible();
  }
});

test('@claim:demo-row-count bundled demo replays five source rows', async () => {
  const result = runBundledDemo();
  expect(result.rows).toBe(5);
  expect(readFileSync(String(result.output_csv), 'utf8').trim().split('\n')).toHaveLength(6);
});

test('@claim:recorded-cli-sample landing recording matches bundled CLI demo outcomes', async ({ page }) => {
  const result = runBundledDemo();
  const validation = JSON.parse(readFileSync(String(result.validation), 'utf8'));
  expect(result).toMatchObject({ rows: 5, validation_errors: 3 });
  expect(validation.issues).toHaveLength(3);
  await page.goto('/');
  await expect(page.getByText('Recorded from the bundled CLI')).toBeVisible();
  await expect(page.locator('#terminal-output')).toContainText('Replay complete: 5 source rows');
  await expect(page.locator('#terminal-output')).toContainText('Validation: 3 errors — review required');
  for (const file of ['output.csv', 'evidence.json', 'validation.json', 'rollback-manifest.json']) {
    await expect(page.locator('#terminal-output')).toContainText(file);
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

test('@claim:cli-offline CLI replays bundled data without a service or account', async () => {
  const output = execFileSync(resolve('target/debug/import-mapping-replay'), ['demo', '--json'], {
    encoding: 'utf8',
    env: { ...process.env, HTTP_PROXY: 'http://127.0.0.1:1', HTTPS_PROXY: 'http://127.0.0.1:1', NO_PROXY: '' },
  });
  const result = JSON.parse(output);
  expect(result.rows).toBe(5);
  expect(result.validation_errors).toBe(3);
  expect(readFileSync(result.output_csv, 'utf8')).toContain('maya.rivera@northstar.example');
});

test('@claim:demo-temp CLI demo copies bundled data into a fresh temporary directory', async () => {
  const result = runBundledDemo();
  expect(String(result.demo_directory)).toContain('import-mapping-replay-demo-');
  expect(existsSync(join(String(result.demo_directory), 'customers.csv'))).toBe(true);
  expect(existsSync(join(String(result.demo_directory), 'mapping.json'))).toBe(true);
});

test('@claim:cli-local-only CLI replay makes no network call', async () => {
  const root = mkdtempSync(join(tmpdir(), 'replay-network-'));
  const guard = networkGuard(root);
  const result = spawnSync(resolve('target/debug/import-mapping-replay'), [
    'run', '--source', resolve('examples/valid-customers.csv'), '--mapping', resolve('examples/mapping.json'), '--out-dir', join(root, 'out'), '--json',
  ], {
    encoding: 'utf8',
    env: { ...process.env, LD_PRELOAD: guard.library, NETWORK_GUARD_LOG: guard.log },
  });
  expect(result.status).toBe(0);
  expect(existsSync(guard.log) ? readFileSync(guard.log, 'utf8') : '').toBe('');
});

test('@claim:rollback-local-scope rollback manifest writes only inside the chosen output directory', async () => {
  const root = mkdtempSync(join(tmpdir(), 'replay-boundary-'));
  const guardRoot = mkdtempSync(join(tmpdir(), 'replay-boundary-network-'));
  const guard = networkGuard(guardRoot);
  const source = join(root, 'customers.csv');
  const mapping = join(root, 'mapping.json');
  const marker = join(root, 'outside.txt');
  const output = join(root, 'output');
  cpSync(resolve('examples/valid-customers.csv'), source);
  cpSync(resolve('examples/mapping.json'), mapping);
  writeFileSync(marker, 'unchanged');
  const beforeSource = readFileSync(source);
  execFileSync(resolve('target/debug/import-mapping-replay'), ['run', '--source', source, '--mapping', mapping, '--out-dir', output], {
    env: { ...process.env, LD_PRELOAD: guard.library, NETWORK_GUARD_LOG: guard.log },
  });
  expect(readFileSync(source)).toEqual(beforeSource);
  expect(readFileSync(marker, 'utf8')).toBe('unchanged');
  expect(readdirSync(root).sort()).toEqual(['customers.csv', 'mapping.json', 'output', 'outside.txt']);
  expect(readdirSync(output).sort()).toEqual(['evidence.json', 'output.csv', 'rollback-manifest.json', 'validation.json']);
  const rollback = JSON.parse(readFileSync(join(output, 'rollback-manifest.json'), 'utf8'));
  expect(rollback.purpose).toContain('local transformation');
  expect(rollback.warning).toContain('cannot undo records');
  expect(existsSync(guard.log) ? readFileSync(guard.log, 'utf8') : '').toBe('');
});

test('@claim:core-no-license the core CLI completes a replay without a license', async () => {
  const out = mkdtempSync(join(tmpdir(), 'replay-no-license-'));
  const result = JSON.parse(execFileSync(resolve('target/debug/import-mapping-replay'), [
    'run', '--source', resolve('examples/valid-customers.csv'), '--mapping', resolve('examples/mapping.json'), '--out-dir', out, '--json',
  ], {
    encoding: 'utf8',
    env: { ...process.env, SB_LICENSE_IMPORT_MAPPING_REPLAY: '', SOCIOBOT_LICENSE: '' },
  }));
  expect(result).toMatchObject({ status: 'valid', rows: 3, validation_errors: 0 });
  expect(readFileSync(join(out, 'output.csv'), 'utf8')).toContain('C-1042,maya@northstar.example,2025-04-18,growth');
});

test('@claim:rust-msrv package metadata declares Rust 1.85 as the minimum compiler', async () => {
  const metadata = JSON.parse(execFileSync('cargo', ['metadata', '--no-deps', '--format-version', '1'], { encoding: 'utf8' }));
  const packageMetadata = metadata.packages.find((item: { name: string }) => item.name === 'import-mapping-replay');
  expect(packageMetadata?.rust_version).toBe('1.85');
});

test('@claim:cli-replay @claim:mapping-v1 @claim:json-output CLI writes deterministic transformed output and manifests', async () => {
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

test('@claim:source-unchanged rejects an output path that resolves to the source CSV', async () => {
  const root = mkdtempSync(join(tmpdir(), 'replay-collision-'));
  const source = join(root, 'output.csv');
  const mapping = join(root, 'mapping.json');
  cpSync(resolve('examples/valid-customers.csv'), source);
  cpSync(resolve('examples/mapping.json'), mapping);
  const before = readFileSync(source);

  const result = spawnSync(resolve('target/debug/import-mapping-replay'), [
    'run', '--source', source, '--mapping', mapping, '--out-dir', root, '--json',
  ], { encoding: 'utf8' });

  expect(result.status).toBe(1);
  expect(result.stderr).toContain('source CSV');
  expect(result.stderr).toContain('resolves to output artifact');
  expect(result.stderr).toContain('choose another --out-dir');
  expect(readFileSync(source)).toEqual(before);
  expect(readdirSync(root).sort()).toEqual(['mapping.json', 'output.csv']);

  const mappingRoot = mkdtempSync(join(tmpdir(), 'replay-mapping-collision-'));
  const mappingSource = join(mappingRoot, 'source.csv');
  const collidingMapping = join(mappingRoot, 'evidence.json');
  cpSync(resolve('examples/valid-customers.csv'), mappingSource);
  cpSync(resolve('examples/mapping.json'), collidingMapping);
  const mappingBefore = readFileSync(collidingMapping);
  const mappingResult = spawnSync(resolve('target/debug/import-mapping-replay'), [
    'run', '--source', mappingSource, '--mapping', collidingMapping, '--out-dir', mappingRoot,
  ], { encoding: 'utf8' });
  expect(mappingResult.status).toBe(1);
  expect(mappingResult.stderr).toContain('mapping');
  expect(mappingResult.stderr).toContain('resolves to output artifact');
  expect(readFileSync(collidingMapping)).toEqual(mappingBefore);
  expect(readdirSync(mappingRoot).sort()).toEqual(['evidence.json', 'source.csv']);
});

test('@claim:atomic-artifacts malformed later rows publish no partial artifacts and preserve a complete replay', async () => {
  const root = mkdtempSync(join(tmpdir(), 'replay-atomic-'));
  const source = join(root, 'source.csv');
  const output = join(root, 'out');
  writeFileSync(source, 'Customer ID,Email,Start Date,Plan\nC-1001,good@example.com,04/18/2025,Starter\nC-1002,short@example.com\n');

  const malformed = spawnSync(resolve('target/debug/import-mapping-replay'), [
    'run', '--source', source, '--mapping', resolve('examples/mapping.json'), '--out-dir', output,
  ], { encoding: 'utf8' });
  expect(malformed.status).toBe(1);
  expect(malformed.stderr).toContain('source CSV row 3 is malformed');
  expect(readdirSync(output)).toEqual([]);

  cpSync(resolve('examples/valid-customers.csv'), source);
  execFileSync(resolve('target/debug/import-mapping-replay'), [
    'run', '--source', source, '--mapping', resolve('examples/mapping.json'), '--out-dir', output,
  ]);
  const before = Object.fromEntries(
    ['output.csv', 'evidence.json', 'validation.json', 'rollback-manifest.json']
      .map(name => [name, readFileSync(join(output, name))]),
  );
  writeFileSync(source, 'Customer ID,Email,Start Date,Plan\nC-1001,good@example.com,04/18/2025,Starter\nC-1002,short@example.com\n');
  const rerun = spawnSync(resolve('target/debug/import-mapping-replay'), [
    'run', '--source', source, '--mapping', resolve('examples/mapping.json'), '--out-dir', output,
  ]);
  expect(rerun.status).toBe(1);
  for (const [name, expected] of Object.entries(before)) {
    expect(readFileSync(join(output, name))).toEqual(expected);
  }
});

test('@claim:checkout-redirect buying the kit redirects from Sociobot to Dodo checkout', async () => {
  for (const method of ['GET', 'HEAD']) {
    const response = await fetch(checkoutUrl, { method, redirect: 'manual' });
    expect(response.status, `${method} checkout response`).toBe(303);
    const location = response.headers.get('location');
    expect(location, `${method} checkout location`).toBeTruthy();
    expect(new URL(location!).hostname).toBe('checkout.dodopayments.com');
  }
});

test('@claim:license-return-storage @claim:license-url-stripping checkout return stores the token and removes it from the URL', async ({ page }) => {
  let verifyUrl = '';
  await page.route('https://api.sociobot.in/**', route => {
    verifyUrl = route.request().url();
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'invalid', expires_at: null }) });
  });

  await page.goto('/?license=returned-secret&ref=checkout#team-kit');
  await expect(page.getByText('License no longer active. Check the token or buy the team kit.')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:import-mapping-replay'))).toBe('returned-secret');
  expect(page.url()).toBe('http://127.0.0.1:4173/?ref=checkout#team-kit');
  expect(verifyUrl).toBe('https://api.sociobot.in/api/v1/products/import-mapping-replay/verify?license=returned-secret');
});

test('purchase copy names the merchant of record and refund handling', async ({ page }) => {
  for (const path of ['/', '/terms']) {
    await page.goto(path);
    await expect(page.getByText('Dodo Payments is the merchant of record and handles refunds.')).toBeVisible();
    await expect(page.getByText('A refund revokes the license automatically.')).toBeVisible();
  }
  await page.goto('/privacy');
  await expect(page.getByText('Dodo Payments is the merchant of record and handles payment data.')).toBeVisible();
  await expect(page.getByText('Dodo Payments handles refunds.')).toBeVisible();
  await expect(page.getByText('A refund revokes the license automatically.')).toBeVisible();
});

test('@claim:paid-kit @claim:license-privacy license verification reveals the £24 team kit download', async ({ page }) => {
  let verifyUrl = '';
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.route('https://api.sociobot.in/**', route => {
    verifyUrl = route.request().url();
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) });
  });
  await page.goto('/');
  await expect(page.getByText('£24', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Buy the team kit/ })).toHaveAttribute('href', checkoutUrl);
  await page.getByLabel('Have a license? Paste it here').fill('test-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('License active. The team kit is ready.')).toBeVisible();
  expect(verifyUrl).toBe('https://api.sociobot.in/api/v1/products/import-mapping-replay/verify?license=test-license');
  expect(requests.filter(url => new URL(url).origin !== 'http://127.0.0.1:4173')).toEqual([verifyUrl]);
  expect(await page.evaluate(() => localStorage.getItem('sb_license:import-mapping-replay'))).toBe('test-license');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download team kit' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('import-mapping-replay-team-kit.json');
  const path = await download.path();
  const kit = JSON.parse(readFileSync(path!, 'utf8'));
  expect(kit.recipes).toHaveLength(5);
  expect(kit.recipes.every((recipe: { id: string; name: string; fields: string[]; steps: string[] }) => recipe.id && recipe.name && recipe.fields.length && recipe.steps.length)).toBe(true);
  expect(kit.review.owner).toEqual({ label: 'Upload owner', value: '' });
  expect(kit.review.approval).toEqual({ label: 'Second engineer approval', value: '' });
  expect(kit.review.checks).toContain('Record approval before upload');
});

test('@claim:website-license-storage-only license flow uses only its two documented browser keys', async ({ page }) => {
  await page.route('https://api.sociobot.in/**', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }),
  }));
  await page.goto('/');
  await page.getByLabel('Have a license? Paste it here').fill('storage-test-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('License active. The team kit is ready.')).toBeVisible();
  const storage = await page.evaluate(async () => ({
    local: Object.keys(localStorage).sort(),
    session: Object.keys(sessionStorage),
    cookies: document.cookie,
    databases: 'databases' in indexedDB ? (await indexedDB.databases()).map(database => database.name) : [],
    caches: 'caches' in window ? await caches.keys() : [],
  }));
  expect(storage).toEqual({
    local: ['sb_license:import-mapping-replay', 'sb_license_verdict:import-mapping-replay'],
    session: [],
    cookies: '',
    databases: [],
    caches: [],
  });
});

test('@claim:license-cache-day cached license is checked at most once in 24 hours', async ({ page }) => {
  let verificationCount = 0;
  await page.route('https://api.sociobot.in/**', route => {
    verificationCount += 1;
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) });
  });
  await page.goto('/');
  await page.getByLabel('Have a license? Paste it here').fill('cache-test-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('License active. The team kit is ready.')).toBeVisible();
  expect(verificationCount).toBe(1);
  await page.reload();
  await expect(page.getByText('License active. The team kit is ready.')).toBeVisible();
  expect(verificationCount).toBe(1);
  await page.evaluate(() => {
    const key = 'sb_license_verdict:import-mapping-replay';
    const verdict = JSON.parse(localStorage.getItem(key) || '{}');
    localStorage.setItem(key, JSON.stringify({ ...verdict, checked: Date.now() - 86_400_001 }));
  });
  await page.reload();
  await expect.poll(() => verificationCount).toBe(2);
});

test('@claim:revoked-license-lock a revoked license locks the team kit', async ({ page }) => {
  let verificationCount = 0;
  await page.route('https://api.sociobot.in/**', route => {
    verificationCount += 1;
    const result = verificationCount === 1
      ? { valid: true, reason: 'ok', expires_at: null }
      : { valid: false, reason: 'revoked', expires_at: null };
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(result) });
  });
  await page.goto('/');
  await page.getByLabel('Have a license? Paste it here').fill('revoked-license-test');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('License active. The team kit is ready.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download team kit' })).toBeVisible();
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('License no longer active. Check the token or buy the team kit.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download team kit' })).toBeHidden();
  expect(verificationCount).toBe(2);
});

test('@claim:actionable-errors invalid input exits non-zero and names the next step', async () => {
  const root = mkdtempSync(join(tmpdir(), 'replay-error-'));
  const source = join(root, 'bad.csv');
  writeFileSync(source, 'Other\nvalue\n');
  const result = spawnSync(resolve('target/debug/import-mapping-replay'), ['run', '--source', source, '--mapping', resolve('examples/mapping.json'), '--out-dir', join(root, 'out')], { encoding: 'utf8' });
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('check the CSV header or mapping');
});

test('initial load preserves document-order keyboard focus and has no serious accessibility errors', async ({ page }) => {
  for (const path of ['/', '/demo', '/privacy', '/terms', '/missing-route']) {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => document.documentElement.clientWidth));
    if ((page.viewportSize()?.width || 0) <= 760) {
      const undersizedTargets = await page.locator('a, button, input').evaluateAll(elements => elements
        .map(element => {
          const box = element.getBoundingClientRect();
          return { label: (element.textContent || element.getAttribute('aria-label') || element.tagName).trim(), width: box.width, height: box.height };
        })
        .filter(target => target.width > 0 && target.height > 0 && (target.width < 44 || target.height < 44)));
      expect(undersizedTargets).toEqual([]);
    }
    await expect(page.locator('h1')).not.toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(item => ['critical', 'serious'].includes(item.impact || ''))).toEqual([]);
  }
});

test('direct demo query is isolated and exposes reset and exit controls', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('sb_license:import-mapping-replay', 'real-license-sentinel'));
  await page.goto('/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start for real' })).toBeVisible();
  await page.getByRole('button', { name: 'Fix the sample email' }).click();
  await expect(page.getByText('Sample correction applied. Two errors remain.')).toBeVisible();
  await expect(page.locator('#demo-error-count')).toHaveText('2');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'The replay needs review' })).toBeFocused();
  await expect(page.locator('#demo-error-value')).toHaveText('email · not-an-email');
  await expect(page.locator('#demo-error-count')).toHaveText('3');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:import-mapping-replay'))).toBe('real-license-sentinel');
});

test('demo first view shows a mapped value and a complete validation row on mobile', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  const snapshot = page.getByLabel('Sample replay result');
  for (const text of ['maya.rivera@northstar.example', 'email · not-an-email', 'Enter an email address.']) {
    await expect(snapshot.getByText(text, { exact: true })).toBeInViewport();
  }
});

test('desktop hero keeps all three product facts in the first viewport', async ({ page }) => {
  test.skip((page.viewportSize()?.width || 0) < 900, 'desktop-only viewport check');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (const text of ['CSV files stay on your computer.', 'The CLI runs without internet.', 'The core CLI needs no license. The team kit costs £24 once.']) {
    const box = await page.getByText(text, { exact: true }).boundingBox();
    expect(box?.y || Infinity).toBeGreaterThanOrEqual(0);
    expect((box?.y || 0) + (box?.height || Infinity)).toBeLessThanOrEqual(page.viewportSize()!.height);
  }
});

test('all routes set specific metadata and unknown routes return HTTP 404', async ({ page, request }) => {
  const expected = [
    ['/', 'Import Mapping Replay — replay CSV imports', 'Replay customer CSV imports into a reviewed output file and error report before upload.', 'https://import-mapping-replay.sociobot.in/'],
    ['/demo', 'Demo — Import Mapping Replay', 'Review the bundled customer CSV replay, three validation errors, and four output files.', 'https://import-mapping-replay.sociobot.in/demo'],
    ['/privacy', 'Privacy — Import Mapping Replay', 'Read how the local CLI handles CSV files and how the website stores a team kit license.', 'https://import-mapping-replay.sociobot.in/privacy'],
    ['/terms', 'Terms — Import Mapping Replay', 'Read the terms for the local Import Mapping Replay CLI and optional team mapping kit.', 'https://import-mapping-replay.sociobot.in/terms'],
  ];
  for (const [path, title, description, canonical] of expected) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const responseHtml = await response.text();
    expect(responseHtml).toContain(`<title>${title}</title>`);
    expect(responseHtml).toContain(`content="${description}"`);
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('footer').getByRole('link', { name: 'Privacy' })).toBeVisible();
    await expect(page.locator('footer').getByRole('link', { name: 'Terms' })).toBeVisible();
  }
  for (const path of ['/404', '/does-not-exist']) {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
    await expect(page).toHaveTitle('Page not found — Import Mapping Replay');
  }
});

test('header keeps Privacy visible and usable', async ({ page }) => {
  await page.goto('/');
  const privacy = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Privacy' });
  await expect(privacy).toBeVisible();
  const box = await privacy.boundingBox();
  if ((page.viewportSize()?.width || 0) <= 760) expect(box?.height).toBeGreaterThanOrEqual(44);
  await privacy.click();
  await expect(page).toHaveURL(/\/privacy$/);
});

test('navigation restores scroll on Back and terminal recording has a clear action', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, document.body.scrollHeight - window.innerHeight - 300);
  });
  const savedScroll = await page.evaluate(() => window.scrollY);
  expect(savedScroll).toBeGreaterThan(1_000);
  await page.evaluate(() => (document.querySelector<HTMLAnchorElement>('a[href="/demo"]') as HTMLAnchorElement).click());
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(savedScroll);
  await page.getByRole('button', { name: 'Show the sample replay again' }).click();
  await expect(page.locator('#terminal-output')).toContainText('Replay complete', { timeout: 3_000 });
});
