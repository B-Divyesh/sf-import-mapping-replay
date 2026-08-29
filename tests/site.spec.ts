import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const checkoutUrl = 'https://api.sociobot.in/api/v1/products/import-mapping-replay/checkout';

function runBundledDemo(): Record<string, string | number> {
  return JSON.parse(execFileSync(resolve('target/debug/import-mapping-replay'), ['demo', '--json'], { encoding: 'utf8' }));
}

function runBundledDemoConcurrently(): Promise<Record<string, string | number>> {
  return new Promise((resolveDemo, rejectDemo) => {
    const child = spawn(resolve('target/debug/import-mapping-replay'), ['demo', '--json']);
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', chunk => { stdout += String(chunk); });
    child.stderr.on('data', chunk => { stderr += String(chunk); });
    child.on('error', rejectDemo);
    child.on('close', code => {
      if (code !== 0) {
        rejectDemo(new Error(`bundled demo exited ${code}: ${stderr}`));
        return;
      }
      try {
        resolveDemo(JSON.parse(stdout));
      } catch (error) {
        rejectDemo(error);
      }
    });
  });
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
  const activeCrossOriginRequests = new Set<object>();
  page.on('request', request => requests.push(request.url()));
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') activeCrossOriginRequests.add(request);
  });
  page.on('requestfinished', request => activeCrossOriginRequests.delete(request));
  page.on('requestfailed', request => activeCrossOriginRequests.delete(request));
  await page.addInitScript(() => localStorage.setItem('sb_license:import-mapping-replay', 'real-license-sentinel'));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  expect(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)))).toEqual({ 'sb_license:import-mapping-replay': 'real-license-sentinel' });
  expect(requests.every(url => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);

  let releaseVerification: (() => void) | undefined;
  const verificationHeld = new Promise<void>(resolveHeld => { releaseVerification = resolveHeld; });
  let markVerificationStarted: (() => void) | undefined;
  const verificationStarted = new Promise<void>(resolveStarted => { markVerificationStarted = resolveStarted; });
  await page.route('https://api.sociobot.in/api/v1/products/import-mapping-replay/verify?**', async route => {
    markVerificationStarted?.();
    await verificationHeld;
    try {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true }) });
    } catch {
      // Entering demo aborts the held verification before this response is released.
    }
  });

  await page.goto('/');
  await verificationStarted;
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  releaseVerification?.();
  await expect.poll(() => activeCrossOriginRequests.size).toBe(0);
  expect(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)))).toEqual({ 'sb_license:import-mapping-replay': 'real-license-sentinel' });
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

test('@claim:demo-temp concurrent CLI demos each receive an isolated temporary directory', async () => {
  const results = await Promise.all(Array.from({ length: 40 }, () => runBundledDemoConcurrently()));
  const directories = results.map(result => String(result.demo_directory));
  expect(new Set(directories).size).toBe(40);
  for (const result of results) {
    const directory = String(result.demo_directory);
    expect(directory).toContain('import-mapping-replay-demo-');
    expect(existsSync(join(directory, 'customers.csv'))).toBe(true);
    expect(existsSync(join(directory, 'mapping.json'))).toBe(true);
    for (const reviewFile of [result.output_csv, result.evidence, result.validation, result.rollback_manifest]) {
      expect(existsSync(String(reviewFile))).toBe(true);
      expect(readFileSync(String(reviewFile), 'utf8').trim()).not.toBe('');
    }
    expect(readFileSync(String(result.output_csv), 'utf8').trim().split('\n')).toHaveLength(6);
    expect(JSON.parse(readFileSync(String(result.evidence), 'utf8'))).toMatchObject({ source_rows: 5, output_rows: 5 });
    expect(JSON.parse(readFileSync(String(result.validation), 'utf8'))).toMatchObject({ error_count: 3, valid: false });
    expect(JSON.parse(readFileSync(String(result.rollback_manifest), 'utf8')).rows).toHaveLength(5);
  }
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
  expect(rollback.warning).toBe('This file cannot undo records already imported into a customer system.');
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

test('@claim:build-artifacts npm run build creates the release CLI and static site', async ({}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'one isolated build proves both browser projects use the same artifacts');
  const root = mkdtempSync(join(tmpdir(), 'replay-build-claim-'));
  for (const file of ['Cargo.toml', 'Cargo.lock', 'package.json', 'package-lock.json', 'vite.config.ts', 'README.md', 'LICENSE']) {
    cpSync(resolve(file), join(root, file));
  }
  for (const directory of ['src', 'site', 'examples']) {
    cpSync(resolve(directory), join(root, directory), { recursive: true });
  }
  symlinkSync(resolve('node_modules'), join(root, 'node_modules'), 'dir');
  execFileSync('npm', ['run', 'build'], {
    cwd: root,
    stdio: 'pipe',
  });
  const executable = join(root, 'target', 'release', 'import-mapping-replay');
  const siteOutput = join(root, 'dist', 'site');
  expect(existsSync(executable)).toBe(true);
  expect(execFileSync(executable, ['--version'], { encoding: 'utf8' })).toContain('0.1.0');
  for (const file of ['index.html', 'demo.html', 'privacy.html', 'terms.html', '404.html', 'staticwebapp.config.json']) {
    expect(existsSync(join(siteOutput, file)), file).toBe(true);
  }
  const assets = readdirSync(join(siteOutput, 'assets'));
  expect(assets.some(file => /^main-[\w-]+\.js$/.test(file))).toBe(true);
  expect(assets.some(file => /^main-[\w-]+\.css$/.test(file))).toBe(true);
});

test('@claim:site-routing-headers static host serves routes, a custom 404, and security headers', async ({ request }) => {
  for (const path of ['/', '/demo', '/privacy', '/terms']) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()['content-security-policy'], path).toContain("frame-ancestors 'none'");
    expect(response.headers()['x-content-type-options'], path).toBe('nosniff');
    expect(response.headers()['referrer-policy'], path).toBe('strict-origin-when-cross-origin');
    expect(response.headers()['permissions-policy'], path).toContain('camera=()');
  }
  for (const path of ['/404', '/claim-missing-route']) {
    for (const method of ['get', 'head'] as const) {
      const response = await request[method](path);
      expect(response.status(), `${method.toUpperCase()} ${path}`).toBe(404);
      if (method === 'get') {
        expect(await response.text()).toContain('<title>Page not found — Import Mapping Replay</title>');
      }
    }
  }
  for (const path of ['/assets/replay-poster.webp', '/assets/og-replay.webp']) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()['cache-control'], path).toBe('public, max-age=0, must-revalidate');
  }
  const assets = readdirSync(resolve('dist/site/assets'));
  const hashedScript = assets.find(file => /^main-[\w-]+\.js$/.test(file));
  expect(hashedScript).toBeTruthy();
  const response = await request.get(`/assets/${hashedScript}`);
  expect(response.headers()['cache-control']).toBe('public, max-age=31536000, immutable');
});

test('@claim:mit-license Cargo metadata and LICENSE contain the MIT terms', async () => {
  const cargo = readFileSync(resolve('Cargo.toml'), 'utf8');
  const license = readFileSync(resolve('LICENSE'), 'utf8');
  expect(cargo).toMatch(/^license = "MIT"$/m);
  expect(license).toContain('Permission is hereby granted, free of charge, to any person obtaining a copy');
  expect(license).toContain('The above copyright notice and this permission notice shall be included in all');
  expect(license).toContain('THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND');
  expect(license).toContain('IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM');
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

test('@claim:email-domain-validation CLI accepts the documented email form and rejects unsupported values', async () => {
  const root = mkdtempSync(join(tmpdir(), 'replay-email-boundaries-'));
  const source = join(root, 'emails.csv');
  const mapping = join(root, 'mapping.json');
  const output = join(root, 'out');
  writeFileSync(source, [
    'email',
    'valid@example.com',
    'person+tag@sub.example.co',
    'māya@example.com',
    'a b@example.com',
    'a@exa mple.com',
    'a@example',
    'a@.com',
    'a@example.',
    'a@b..com',
  ].join('\n') + '\n');
  writeFileSync(mapping, JSON.stringify({
    version: 1,
    fields: [{ target: 'email', source: 'email', validate: [{ rule: 'email' }] }],
  }));

  const result = spawnSync(resolve('target/debug/import-mapping-replay'), [
    'run', '--source', source, '--mapping', mapping, '--out-dir', output, '--json',
  ], { encoding: 'utf8' });

  expect(result.status).toBe(2);
  expect(result.stderr).toBe('');
  expect(JSON.parse(result.stdout)).toMatchObject({ status: 'review_required', rows: 9, validation_errors: 7 });
  const validation = JSON.parse(readFileSync(join(output, 'validation.json'), 'utf8'));
  expect(readFileSync(join(output, 'output.csv'), 'utf8')).toContain('valid@example.com');
  expect(readFileSync(join(output, 'output.csv'), 'utf8')).toContain('person+tag@sub.example.co');
  expect(validation).toMatchObject({ valid: false, error_count: 7 });
  expect(validation.issues).toEqual(expect.arrayContaining([
    expect.objectContaining({ source_row: 4, rule: 'email', value: 'māya@example.com' }),
    expect.objectContaining({ source_row: 5, rule: 'email', value: 'a b@example.com' }),
    expect.objectContaining({ source_row: 6, rule: 'email', value: 'a@exa mple.com' }),
    expect.objectContaining({ source_row: 7, rule: 'email', value: 'a@example' }),
    expect.objectContaining({ source_row: 8, rule: 'email', value: 'a@.com' }),
    expect.objectContaining({ source_row: 9, rule: 'email', value: 'a@example.' }),
    expect.objectContaining({ source_row: 10, rule: 'email', value: 'a@b..com' }),
  ]));
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
  expect(result.stderr).toBe('');
  const sourceError = JSON.parse(result.stdout);
  expect(sourceError.status).toBe('error');
  expect(sourceError.error).toContain('source CSV');
  expect(sourceError.error).toContain('resolves to review file');
  expect(sourceError.error).toContain('choose another --out-dir');
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
  expect(mappingResult.stderr).toContain('resolves to review file');
  expect(readFileSync(collidingMapping)).toEqual(mappingBefore);
  expect(readdirSync(mappingRoot).sort()).toEqual(['evidence.json', 'source.csv']);
});

test('@claim:atomic-review-files malformed later rows publish no partial review files and preserve a complete replay', async () => {
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

test('@claim:duplicate-source-headers duplicate CSV headers fail before output is created', async () => {
  const root = mkdtempSync(join(tmpdir(), 'replay-duplicate-header-'));
  const source = join(root, 'duplicate.csv');
  const mapping = join(root, 'mapping.json');
  const output = join(root, 'out');
  writeFileSync(source, 'A,A\nfirst,second\n');
  writeFileSync(mapping, '{"version":1,"fields":[{"target":"chosen","source":"A"}]}');

  const result = spawnSync(resolve('target/debug/import-mapping-replay'), [
    'run', '--source', source, '--mapping', mapping, '--out-dir', output, '--json',
  ], { encoding: 'utf8' });

  expect(result.status).toBe(1);
  expect(result.stderr).toBe('');
  expect(JSON.parse(result.stdout)).toMatchObject({
    status: 'error',
    error: expect.stringContaining('source CSV header "A" appears more than once'),
  });
  expect(existsSync(output)).toBe(false);
});

test('@claim:json-error-output --json writes a parseable error response for invalid input', async () => {
  const root = mkdtempSync(join(tmpdir(), 'replay-json-error-'));
  const missing = join(root, 'does-not-exist.csv');
  const result = spawnSync(resolve('target/debug/import-mapping-replay'), [
    'run', '--source', missing, '--mapping', resolve('examples/mapping.json'), '--out-dir', join(root, 'out'), '--json',
  ], { encoding: 'utf8' });

  expect(result.status).toBe(1);
  expect(result.stderr).toBe('');
  expect(JSON.parse(result.stdout)).toMatchObject({
    status: 'error',
    error: expect.stringContaining('could not read source CSV'),
  });
  expect(JSON.parse(result.stdout).error).toContain('check the path');
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

test('@claim:license-return-token-binding returned checkout tokens never reuse another token’s verdict', async ({ page }) => {
  const verifiedTokens: string[] = [];
  await page.route('https://api.sociobot.in/**', route => {
    const token = new URL(route.request().url()).searchParams.get('license');
    verifiedTokens.push(token || '');
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ valid: token === 'new-valid-token', reason: token === 'new-valid-token' ? 'ok' : 'invalid', expires_at: null }),
    });
  });

  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('sb_license:import-mapping-replay', 'old-valid-token');
    localStorage.setItem('sb_license_verdict:import-mapping-replay', JSON.stringify({
      token: 'old-valid-token', valid: true, checked: Date.now(),
    }));
  });
  await page.goto('/?license=new-invalid-token&ref=qa12#team-kit');
  await expect(page.getByText('License no longer active. Check the token or buy the team kit.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download team kit' })).toBeHidden();
  expect(verifiedTokens).toEqual(['new-invalid-token']);
  expect(await page.evaluate(() => localStorage.getItem('sb_license:import-mapping-replay'))).toBe('new-invalid-token');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sb_license_verdict:import-mapping-replay') || 'null'))).toEqual(expect.objectContaining({
    token: 'new-invalid-token', valid: false,
  }));

  await page.evaluate(() => {
    localStorage.setItem('sb_license:import-mapping-replay', 'old-invalid-token');
    localStorage.setItem('sb_license_verdict:import-mapping-replay', JSON.stringify({
      token: 'old-invalid-token', valid: false, checked: Date.now(),
    }));
  });
  verifiedTokens.length = 0;
  await page.goto('/?license=new-valid-token&ref=qa12#team-kit');
  await expect(page.getByText('License active. The team kit is ready.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download team kit' })).toBeVisible();
  expect(verifiedTokens).toEqual(['new-valid-token']);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sb_license_verdict:import-mapping-replay') || 'null'))).toEqual(expect.objectContaining({
    token: 'new-valid-token', valid: true,
  }));
});

test('purchase copy keeps only the checkout behavior covered by evidence', async ({ page }) => {
  for (const path of ['/', '/privacy', '/terms']) {
    await page.goto(path);
    await expect(page.getByText('Checkout opens through Sociobot on Dodo Payments.')).toBeVisible();
    await expect(page.getByText(/merchant of record|handles refunds|payment data|refund revokes/i)).toHaveCount(0);
  }
});

test('documentation and page copy retain every reviewed wording correction', async ({ page }) => {
  const readme = readFileSync(resolve('README.md'), 'utf8');
  const claims = JSON.parse(readFileSync(resolve('.factory/claims.json'), 'utf8')) as Array<{ id: string; claim: string; test: string }>;
  expect(readme).toContain('## Run a CSV replay');
  expect(readme).toContain('Install from this source checkout');
  expect(readme).toContain('Run `cargo package` to check the release archive.');
  expect(readme).toContain('`npm run build` creates the release binary and the static site in `dist/site`.');
  expect(readme).toContain('Production site: <https://import-mapping-replay.sociobot.in>');
  expect(readme).toContain('MIT. See [LICENSE](LICENSE).');
  expect(readme).toContain('It does not connect to or undo records in a customer system.');
  expect(readme).toContain('It cannot undo records already uploaded to a customer system.');
  expect(readme).toContain('It runs the replay and prints every review file path.');
  expect(readme).toContain('The CLI rejects a source or mapping that resolves to a review file.');
  expect(readme).toContain('It builds all four review files in a staging directory and publishes them only after the replay succeeds.');
  expect(readme).toContain('A malformed later row publishes no partial review files.');
  expect(readme).toContain('a failed rerun leaves all four review files unchanged.');
  expect(readme).not.toContain('The factory publishes releases.');
  expect(readme).not.toContain('ready for registry review');
  expect(readme).not.toContain('SaaS account');
  expect(readme).not.toMatch(/another product|imported elsewhere|output artifact|all four artifacts|partial artifact|all four prior files/i);
  expect(claims.find(claim => claim.id === 'rollback-local-scope')?.claim).toBe('The rollback manifest preserves local source rows and does not change a customer system.');
  expect(claims.find(claim => claim.id === 'atomic-review-files')).toMatchObject({
    claim: 'A malformed later CSV row publishes no partial review files and leaves all review files from any previous complete replay unchanged.',
  });
  expect(claims.some(claim => claim.id === 'atomic-artifacts')).toBe(false);

  const catalog = readFileSync(resolve('.factory/catalog-description.txt'), 'utf8').trim();
  expect(catalog).toBe('Replay customer CSV imports and inspect mapped values, errors, and source rows.');
  expect(catalog.length).toBeLessThanOrEqual(120);

  await page.goto('/');
  for (const text of [
    'Replay CSV imports before upload',
    'How the replay works',
    'What the CLI does not do',
    'Show the sample replay again',
    'It does not connect to a customer system.',
    'A rollback manifest cannot undo records imported into a customer system.',
    'Five named mapping recipes for common template fields.',
    'A review checklist with upload owner and second-engineer approval fields.',
  ]) {
    await expect(page.getByText(text, { exact: true })).toBeVisible();
  }
  const landingCopy = await page.locator('body').innerText();

  await page.goto('/terms');
  await expect(page.getByText('Review every result before sending data to a customer system.', { exact: true })).toBeVisible();
  await expect(page.getByText('It cannot delete or change records in a customer system.', { exact: false })).toBeVisible();
  const publishedCopy = `${readme}\n${landingCopy}\n${await page.locator('body').innerText()}`;
  expect(publishedCopy).not.toMatch(/another product|imported elsewhere|output artifact|all four artifacts|partial artifact|all four prior files/i);
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

test('@claim:license-unavailable-fallback an aged valid result keeps the team kit available when verification fails', async ({ page }) => {
  const cachedVerdict = { token: 'outage-test-license', valid: true, checked: Date.now() - 86_400_001 };
  await page.addInitScript(({ cachedVerdict }) => {
    localStorage.setItem('sb_license:import-mapping-replay', 'outage-test-license');
    localStorage.setItem('sb_license_verdict:import-mapping-replay', JSON.stringify(cachedVerdict));
  }, { cachedVerdict });
  let verificationCount = 0;
  await page.route('https://api.sociobot.in/**', route => {
    verificationCount += 1;
    return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'temporarily unavailable' }) });
  });

  await page.goto('/');
  await expect(page.getByText('Using the last valid check while verification is unavailable.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download team kit' })).toBeVisible();
  expect(verificationCount).toBe(1);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sb_license_verdict:import-mapping-replay') || 'null'))).toEqual(cachedVerdict);
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

test('correcting the sample keeps validation results, focus, and the live result in sync', async ({ page }) => {
  await page.goto('/demo');
  const fix = page.getByRole('button', { name: 'Fix the sample email' });
  await fix.focus();
  await expect(fix).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page.locator('#demo-error-count')).toHaveText('2');
  await expect(page.locator('#demo-summary-line')).toHaveText('Five sample customers · two errors');
  await expect(page.locator('#demo-validation-summary')).toHaveText('Two sample validation errors remain.');
  await expect(page.locator('.issue-table tbody tr')).toHaveCount(2);
  await expect(page.locator('.issue-table')).not.toContainText('not-an-email');
  await expect(page.locator('.issue-table')).toContainText('C-1043');
  await expect(page.locator('.issue-table')).toContainText('legacy');
  await expect(page.getByRole('button', { name: 'Sample email corrected' })).toBeDisabled();

  const result = page.locator('#demo-correction-status');
  await expect(result).toHaveAttribute('role', 'status');
  await expect(result).toHaveAttribute('aria-atomic', 'true');
  await expect(result).toHaveText('Row 5 corrected. Two validation errors remain.');
  await expect(result).toBeFocused();
});

test('demo first view shows a mapped value and a complete validation row on mobile', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/\?demo=1$/);
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
    ['/demo', 'Demo — Import Mapping Replay', 'Review the bundled customer CSV replay, three validation errors, and four review files.', 'https://import-mapping-replay.sociobot.in/demo'],
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
  await page.evaluate(() => (document.querySelector<HTMLAnchorElement>('a[href="/?demo=1"]') as HTMLAnchorElement).click());
  await expect(page).toHaveURL(/\/\?demo=1$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(savedScroll);
  await page.getByRole('button', { name: 'Show the sample replay again' }).click();
  await expect(page.locator('#terminal-output')).toContainText('Replay complete', { timeout: 3_000 });
});
