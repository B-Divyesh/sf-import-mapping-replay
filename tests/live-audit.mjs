import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright-core';

const baseUrl = process.argv[2] || 'https://import-mapping-replay.sociobot.in';
const evidenceDir = resolve(process.argv[3] || '.factory/evidence/live');
const billingUrl = 'https://api.sociobot.in/api/v1/products/import-mapping-replay/verify';
const licenseKey = 'sb_license:import-mapping-replay';
const verdictKey = 'sb_license_verdict:import-mapping-replay';
const routes = [
  ['/', 200, 'Import Mapping Replay — replay CSV imports', 'Replay CSV imports before upload', 'Replay customer CSV imports into a reviewed output file and error report before upload.', '/'],
  ['/demo', 200, 'Demo — Import Mapping Replay', 'Review a finished CSV replay', 'Review the bundled customer CSV replay, three validation errors, and four output files.', '/demo'],
  ['/privacy', 200, 'Privacy — Import Mapping Replay', 'Keep customer CSV files local', 'Read how the local CLI handles CSV files and how the website stores a team kit license.', '/privacy'],
  ['/terms', 200, 'Terms — Import Mapping Replay', 'Use replay files before uploading', 'Read the terms for the local Import Mapping Replay CLI and optional team mapping kit.', '/terms'],
  ['/404', 404, 'Page not found — Import Mapping Replay', 'Page not found', 'The requested Import Mapping Replay page was not found.', '/404'],
  ['/polish-6-not-found', 404, 'Page not found — Import Mapping Replay', 'Page not found', 'The requested Import Mapping Replay page was not found.', '/404'],
];

mkdirSync(evidenceDir, { recursive: true });

async function waitFor(check, label, timeout = 5_000) {
  const started = Date.now();
  while (!(await check())) {
    if (Date.now() - started > timeout) throw new Error(`Timed out waiting for ${label}`);
    await new Promise(resolve => setTimeout(resolve, 25));
  }
}

const browser = await chromium.launch();
const report = { baseUrl, routes: [], demo: {}, licenseFallback: {}, history: {}, consoleErrors: [] };

try {
  for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    for (const [path, expectedStatus, title, h1, description, canonical] of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(String(error)));
      page.on('console', message => {
        if (message.type() === 'error' && !(expectedStatus === 404 && message.text().includes('404'))) errors.push(message.text());
      });
      const response = await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' });
      assert.equal(response?.status(), expectedStatus, `${viewport.name} ${path} status`);
      assert.equal(await page.title(), title, `${viewport.name} ${path} title`);
      assert.equal(await page.locator('h1').count(), 1, `${viewport.name} ${path} h1 count`);
      assert.equal((await page.locator('h1').textContent())?.trim(), h1, `${viewport.name} ${path} h1`);
      assert.equal(await page.locator('main').count(), 1, `${viewport.name} ${path} main count`);
      assert.equal(await page.locator('html').getAttribute('lang'), 'en', `${viewport.name} ${path} lang`);
      assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), description, `${viewport.name} ${path} description`);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${baseUrl}${canonical}`, `${viewport.name} ${path} canonical`);
      assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'), title, `${viewport.name} ${path} OG title`);
      assert.equal(await page.locator('meta[property="og:description"]').getAttribute('content'), description, `${viewport.name} ${path} OG description`);
      assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), `${baseUrl}${canonical}`, `${viewport.name} ${path} OG URL`);
      assert.equal(await page.locator('meta[name="twitter:title"]').getAttribute('content'), title, `${viewport.name} ${path} Twitter title`);
      assert.equal(await page.locator('meta[name="twitter:description"]').getAttribute('content'), description, `${viewport.name} ${path} Twitter description`);
      assert.equal(await page.getByRole('link', { name: 'Skip to main content' }).count(), 1, `${viewport.name} ${path} skip link`);
      assert.equal(await page.locator('footer').getByRole('link', { name: 'Privacy' }).isVisible(), true, `${viewport.name} ${path} Privacy link`);
      assert.equal(await page.locator('footer').getByRole('link', { name: 'Terms' }).isVisible(), true, `${viewport.name} ${path} Terms link`);
      const axe = await new AxeBuilder({ page }).analyze();
      assert.equal(axe.violations.length, 0, `${viewport.name} ${path} Axe violations`);
      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      assert.equal(hasOverflow, false, `${viewport.name} ${path} horizontal overflow`);
      if (viewport.name === 'mobile') {
        const undersizedTargets = await page.locator('a, button, input').evaluateAll(elements => elements
          .map(element => {
            const box = element.getBoundingClientRect();
            return { label: (element.textContent || element.getAttribute('aria-label') || element.tagName).trim(), width: box.width, height: box.height };
          })
          .filter(target => target.width > 0 && target.height > 0 && (target.width < 44 || target.height < 44)));
        assert.deepEqual(undersizedTargets, [], `${path} mobile touch targets`);
      }
      if (path === '/') {
        for (const fact of ['CSV files stay on your computer.', 'The CLI runs without internet.', 'The core CLI needs no license. The team kit costs £24 once.']) {
          const box = await page.getByText(fact, { exact: true }).boundingBox();
          assert.ok(box && box.y + box.height <= viewport.height, `${viewport.name} first screen fact: ${fact}`);
        }
      }
      assert.deepEqual(errors, [], `${viewport.name} ${path} console/page errors`);
      const headers = response?.headers() || {};
      assert.match(headers['content-security-policy'] || '', /frame-ancestors 'none'/, `${path} CSP`);
      assert.equal(headers['x-content-type-options'], 'nosniff', `${path} nosniff`);
      report.routes.push({ viewport: viewport.name, path, status: response?.status(), title, axeViolations: 0, horizontalOverflow: false });
      if (path !== '/polish-6-not-found') {
        await page.screenshot({ path: join(evidenceDir, `${path === '/' ? 'home' : path.slice(1)}-${viewport.name}-cold.png`), fullPage: true });
      }
      await page.close();
    }
    await context.close();
  }

  const directContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const directPage = await directContext.newPage();
  const directRequests = [];
  const directStorage = { [licenseKey]: 'REAL-SENTINEL', [verdictKey]: 'REAL-VERDICT-SENTINEL' };
  await directPage.addInitScript(({ licenseKey, verdictKey }) => {
    localStorage.setItem(licenseKey, 'REAL-SENTINEL');
    localStorage.setItem(verdictKey, 'REAL-VERDICT-SENTINEL');
  }, { licenseKey, verdictKey });
  directPage.on('request', request => directRequests.push(request.url()));
  await directPage.goto(`${baseUrl}/?demo=1`, { waitUntil: 'networkidle' });
  assert.equal(new URL(directPage.url()).search, '?demo=1');
  assert.equal(await directPage.getByText('Demo — sample data, nothing is saved').isVisible(), true);
  assert.equal(await directPage.getByRole('button', { name: 'Reset demo' }).isVisible(), true);
  assert.equal(await directPage.getByRole('link', { name: 'Start for real' }).isVisible(), true);
  for (const text of ['Maya.Rivera@Northstar.example', 'maya.rivera@northstar.example', 'email · not-an-email']) {
    const box = await directPage.getByText(text, { exact: true }).boundingBox();
    assert.ok(box && box.y + box.height <= 844, `${text} must fit in the mobile demo first screen`);
  }
  await directPage.getByRole('button', { name: 'Fix the sample email' }).click();
  assert.equal(await directPage.locator('#demo-error-count').textContent(), '2');
  await directPage.getByRole('button', { name: 'Reset demo' }).click();
  assert.equal(await directPage.locator('#demo-error-count').textContent(), '3');
  assert.equal(await directPage.locator('#result-title').evaluate(element => element === document.activeElement), true);
  assert.deepEqual(await directPage.evaluate(() => Object.fromEntries(Object.entries(localStorage))), directStorage);
  assert.equal(directRequests.every(url => new URL(url).origin === new URL(baseUrl).origin), true);
  report.demo.direct = { storage: directStorage, sameOriginOnly: true, resetRestoredErrors: 3 };
  await directContext.close();

  const raceContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const racePage = await raceContext.newPage();
  await racePage.addInitScript(key => localStorage.setItem(key, 'REAL-SENTINEL'), licenseKey);
  const activeCrossOrigin = new Set();
  racePage.on('request', request => {
    if (new URL(request.url()).origin !== new URL(baseUrl).origin) activeCrossOrigin.add(request);
  });
  racePage.on('requestfinished', request => activeCrossOrigin.delete(request));
  racePage.on('requestfailed', request => activeCrossOrigin.delete(request));
  let releaseVerification;
  const held = new Promise(resolve => { releaseVerification = resolve; });
  let markStarted;
  const started = new Promise(resolve => { markStarted = resolve; });
  await racePage.route(`${billingUrl}?**`, async route => {
    markStarted();
    await held;
    try {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true }) });
    } catch {
      // The browser correctly canceled the real-license request on demo entry.
    }
  });
  await racePage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await started;
  await racePage.getByRole('link', { name: 'Try it with sample data' }).click();
  await racePage.getByText('Demo — sample data, nothing is saved').waitFor();
  releaseVerification();
  await waitFor(() => activeCrossOrigin.size === 0, 'the license request to abort');
  await racePage.waitForTimeout(150);
  assert.deepEqual(await racePage.evaluate(() => Object.fromEntries(Object.entries(localStorage))), { [licenseKey]: 'REAL-SENTINEL' });
  report.demo.landingTransition = { storage: { [licenseKey]: 'REAL-SENTINEL' }, activeCrossOriginRequests: 0 };
  await raceContext.close();

  const outageContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const outagePage = await outageContext.newPage();
  const agedVerdict = { valid: true, checked: Date.now() - 86_400_001 };
  await outagePage.addInitScript(({ licenseKey, verdictKey, agedVerdict }) => {
    localStorage.setItem(licenseKey, 'OUTAGE-SENTINEL');
    localStorage.setItem(verdictKey, JSON.stringify(agedVerdict));
  }, { licenseKey, verdictKey, agedVerdict });
  let outageChecks = 0;
  await outagePage.route(`${billingUrl}?**`, route => {
    outageChecks += 1;
    return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'temporarily unavailable' }) });
  });
  await outagePage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  assert.equal(await outagePage.getByText('Using the last valid check while verification is unavailable.').isVisible(), true);
  assert.equal(await outagePage.getByRole('button', { name: 'Download team kit' }).isVisible(), true);
  assert.equal(outageChecks, 1);
  assert.deepEqual(JSON.parse(await outagePage.evaluate(key => localStorage.getItem(key), verdictKey)), agedVerdict);
  report.licenseFallback = { status: 'cached valid result retained', downloadVisible: true, verificationStatus: 503, verificationChecks: 1 };
  await outagePage.screenshot({ path: join(evidenceDir, 'license-fallback-mobile.png'), fullPage: true });
  await outageContext.close();

  const homeContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const homePage = await homeContext.newPage();
  await homePage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  for (const fact of ['CSV files stay on your computer.', 'The CLI runs without internet.', 'The core CLI needs no license. The team kit costs £24 once.']) {
    const box = await homePage.getByText(fact, { exact: true }).boundingBox();
    assert.ok(box && box.y + box.height <= 900, `${fact} must fit in the desktop first screen`);
  }
  await homePage.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, document.body.scrollHeight - window.innerHeight - 300);
  });
  const scrollBefore = await homePage.evaluate(() => window.scrollY);
  assert.ok(scrollBefore > 1_000, 'history test must begin below the first screen');
  await homePage.evaluate(() => document.querySelector('a[href="/?demo=1"]')?.click());
  await homePage.goBack();
  await waitFor(async () => Math.abs((await homePage.evaluate(() => window.scrollY)) - scrollBefore) < 2, 'history scroll restoration');
  assert.equal(await homePage.locator('#page-title').evaluate(element => element === document.activeElement), true);
  report.history = { scrollBefore, scrollAfter: await homePage.evaluate(() => window.scrollY), focus: '#page-title' };
  await homeContext.close();

  const copyContext = await browser.newContext();
  const copyPage = await copyContext.newPage();
  for (const path of ['/', '/privacy', '/terms']) {
    await copyPage.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' });
    const text = (await copyPage.locator('body').innerText()).toLowerCase();
    for (const removed of ['merchant of record', 'handles refunds', 'card details', 'one buyer']) assert.equal(text.includes(removed), false, `${path} removed claim: ${removed}`);
    if (path === '/') {
      for (const required of [
        'replay csv imports before upload',
        'for implementation engineers who need a reviewed output csv and error report before each customer upload.',
        'try it with sample data',
        'how the replay works',
        'what the cli does not do',
        'show the sample replay again',
        'it does not connect to a customer system.',
        'five named mapping recipes for common template fields.',
        'a review checklist with upload owner and second-engineer approval fields.',
      ]) assert.equal(text.includes(required), true, `${path} required copy: ${required}`);
    }
  }
  await copyContext.close();

  writeFileSync(join(evidenceDir, 'cold-audit.json'), JSON.stringify(report, null, 2));
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} finally {
  await browser.close();
}
