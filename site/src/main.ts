const PRODUCT = 'Import Mapping Replay';
const SLUG = 'import-mapping-replay';
const BILLING = `https://api.sociobot.in/api/v1/products/${SLUG}`;
const LICENSE_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${SLUG}`;

type Route = '/' | '/demo' | '/privacy' | '/terms' | '/404';

const sampleTranscript = `<span class="prompt">$ import-mapping-replay demo</span>
Replay complete: 5 source rows
Validation: <span class="error">3 errors — review required</span>

<span class="error">row 5 · email · not-an-email</span>
Value is not an email address; correct it.
<span class="error">row 6 · external_id · C-1043</span>
Value already appears on source row 3; make it unique.
<span class="error">row 6 · plan · legacy</span>
Value is not allowed; use starter, growth, or enterprise.

<span class="ok">Wrote output.csv, evidence.json,
validation.json, rollback-manifest.json</span>`;

const header = (active: Route) => `
  <header class="site-header">
    <div class="header-inner">
      <a class="wordmark" href="/" data-link>Import Mapping Replay</a>
      <nav class="site-nav" aria-label="Main navigation">
        <a href="/demo" data-link ${active === '/demo' ? 'aria-current="page"' : ''}>Demo</a>
        <a href="/#how" data-link>How it works</a>
        <a href="/privacy" data-link ${active === '/privacy' ? 'aria-current="page"' : ''}>Privacy</a>
      </nav>
    </div>
  </header>`;

const footer = `
  <footer class="site-footer">
    <div class="footer-inner">
      <div>Replay local CSV mappings with review evidence.</div>
      <div class="footer-links">
        <a href="/privacy" data-link>Privacy</a>
        <a href="/terms" data-link>Terms</a>
        <a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a>
        <span>Version 0.1.0 · build 2026.08.28</span>
      </div>
    </div>
  </footer>`;

const terminal = (controls = true) => `
  <div class="terminal" aria-label="Recorded terminal run with sample data">
    <div class="terminal-bar" aria-hidden="true"><span class="terminal-dot"></span><span class="terminal-dot"></span><span class="terminal-dot"></span><span class="terminal-title">local terminal · sample run</span></div>
    <pre id="terminal-output">${sampleTranscript}</pre>
    ${controls ? '<div class="terminal-controls"><button id="replay-terminal" type="button">Replay recording</button></div>' : ''}
  </div>
  <div class="artifact-strip" aria-label="Files written by the sample run">
    <div><strong>output.csv</strong><span>Mapped rows</span></div>
    <div><strong>evidence.json</strong><span>Before and after</span></div>
    <div><strong>validation.json</strong><span>Three issues</span></div>
    <div><strong>rollback-manifest.json</strong><span>Original rows</span></div>
  </div>`;

const landing = `
  ${header('/')}
  <main id="main" tabindex="-1">
    <section class="hero" aria-labelledby="page-title">
      <div class="hero-grid">
        <div>
          <p class="eyebrow">Local CSV replay</p>
          <h1 id="page-title" tabindex="-1">Replay CSV mappings with proof</h1>
          <p class="lede">For implementation engineers who need each customer import reviewed, rerun, and traced.</p>
          <div class="hero-action">
            <a class="button" href="/demo" data-link>Try it with sample data</a>
            <span class="next-note">See a finished replay and three caught errors.</span>
          </div>
          <ul class="facts" aria-label="Product facts">
            <li>CSV files stay on your computer.</li>
            <li>The CLI runs without internet.</li>
            <li>Replay costs £0. The team kit costs £24 once.</li>
          </ul>
        </div>
        <figure class="poster-frame">
          <img src="/assets/replay-poster.webp" width="1536" height="1024" fetchpriority="high" alt="A CSV ticket passes through three mapping rails and becomes an ordered manifest.">
        </figure>
      </div>
    </section>

    <section class="section dark-section" aria-labelledby="preview-title">
      <div class="section-inner">
        <div class="section-intro">
          <p class="eyebrow">Recorded from the real CLI</p>
          <h2 id="preview-title">See the failed rows before upload</h2>
          <p>The sample replay transforms five customers and writes four review files. It catches three source errors.</p>
        </div>
        ${terminal(true)}
      </div>
    </section>

    <section class="section" id="how" aria-labelledby="how-title">
      <div class="section-inner">
        <div class="section-intro">
          <p class="eyebrow">One route, every time</p>
          <h2 id="how-title">Replay an import in three steps</h2>
        </div>
        <ol class="route-steps">
          <li><span class="step-number" aria-hidden="true">1</span><h3>Map the columns</h3><p>Name each source and target field in a version 1 JSON file.</p></li>
          <li><span class="step-number" aria-hidden="true">2</span><h3>Run the local CLI</h3><p>Apply trim, case, replacement, and date rules without uploading the CSV.</p></li>
          <li><span class="step-number" aria-hidden="true">3</span><h3>Review the evidence</h3><p>Check row errors, before-and-after values, hashes, and untouched source rows.</p></li>
        </ol>
      </div>
    </section>

    <section class="section dark-section" id="install" aria-labelledby="install-title">
      <div class="section-inner limits-grid">
        <div>
          <p class="eyebrow">Install locally</p>
          <h2 id="install-title">Build one binary</h2>
          <p>Rust 1.85 or newer builds the CLI. No account is required.</p>
          <div class="terminal"><pre><span class="prompt">$ cargo install --git https://github.com/B-Divyesh/sf-import-mapping-replay</span>
$ import-mapping-replay demo</pre></div>
        </div>
        <div>
          <h3>This tool stays narrow</h3>
          <ul class="plain-list">
            <li>It does not connect to a SaaS account.</li>
            <li>It does not schedule or upload imports.</li>
            <li>It does not change a source CSV.</li>
            <li>A rollback manifest cannot undo records imported elsewhere.</li>
          </ul>
          <p class="notice">Keep the source CSV, mapping, and review files together for each customer upload.</p>
        </div>
      </div>
    </section>

    <section class="section" id="team-kit" aria-labelledby="price-title">
      <div class="section-inner price-grid">
        <div>
          <p class="eyebrow">Optional team kit</p>
          <h2 id="price-title">Standardise the review handoff</h2>
          <p>The CLI stays free. The team kit adds mapping recipes and a sign-off checklist.</p>
          <ul class="plain-list"><li>Five mapping recipes for common template fields.</li><li>A review checklist with owner and approval fields.</li></ul>
        </div>
        <div class="price-ticket">
          <h3>Team mapping kit</h3>
          <p class="price">£24</p>
          <p>One-time purchase. Sociobot and Dodo are the merchant of record.</p>
          <a class="button" href="https://api.sociobot.in/api/v1/products/import-mapping-replay/checkout">Buy the team kit <span class="sr-only">at hosted checkout</span></a>
          <p><small>Refunds are handled by the merchant. A refund revokes the license.</small></p>
          <form id="license-form" class="license-form">
            <label for="license">Have a license? Paste it here</label>
            <div class="license-row"><input id="license" name="license" type="password" autocomplete="off"><button class="button secondary" type="submit">Verify license</button></div>
            <div id="license-status" class="license-status" aria-live="polite">The free CLI does not need a license.</div>
          </form>
          <div id="kit-panel" class="kit-panel" hidden><p>Your team kit is ready on this device.</p><button id="download-kit" class="button secondary" type="button">Download team kit</button></div>
          <p><small>Read the <a href="/privacy" data-link>privacy notice</a> and <a href="/terms" data-link>terms</a>.</small></p>
        </div>
      </div>
    </section>
  </main>
  ${footer}`;

const demo = `
  <div class="demo-banner" role="status"><span>Demo — sample data, nothing is saved</span><button id="reset-demo" type="button">Reset demo</button><a href="/#install" data-link>Start for real</a></div>
  ${header('/demo')}
  <main id="main" tabindex="-1" class="content-page">
    <section class="page-hero">
      <div class="section-inner">
        <p class="eyebrow">Five sample customers</p>
        <h1 id="page-title" tabindex="-1">Review a finished CSV replay</h1>
        <p class="lede">This isolated sample shows transformed rows, three validation errors, and every review file.</p>
      </div>
    </section>
    <section class="section demo-workspace" aria-labelledby="result-title">
      <div class="section-inner">
        <h2 id="result-title" tabindex="-1">The replay needs review</h2>
        <div class="demo-summary"><div><strong>5</strong><span>source rows</span></div><div><strong>4</strong><span>mapped fields</span></div><div><strong>3</strong><span>errors found</span></div></div>
        <div class="section-intro"><h3>Validation results</h3><p>Fix these source values, then run the same mapping again.</p></div>
        <table class="issue-table">
          <thead><tr><th>Source row</th><th>Field</th><th>Value</th><th>What to fix</th></tr></thead>
          <tbody>
            <tr><td data-label="Source row">5</td><td data-label="Field">email</td><td data-label="Value"><code>not-an-email</code></td><td data-label="What to fix">Enter an email address.</td></tr>
            <tr><td data-label="Source row">6</td><td data-label="Field">external_id</td><td data-label="Value"><code>C-1043</code></td><td data-label="What to fix">Use an ID not found on row 3.</td></tr>
            <tr><td data-label="Source row">6</td><td data-label="Field">plan</td><td data-label="Value"><code>legacy</code></td><td data-label="What to fix">Use starter, growth, or enterprise.</td></tr>
          </tbody>
        </table>
        <div class="section demo-workspace"><h3>Recorded CLI output</h3>${terminal(false)}</div>
      </div>
    </section>
  </main>
  ${footer}`;

const privacy = `
  ${header('/privacy')}
  <main id="main" tabindex="-1" class="content-page">
    <section class="page-hero"><div class="section-inner"><p class="eyebrow">Privacy</p><h1 id="page-title" tabindex="-1">Keep customer CSV files local</h1><p class="lede">The CLI reads and writes files only on your computer.</p></div></section>
    <section class="section"><div class="section-inner prose">
      <h2>What the CLI handles</h2><p>The CLI reads the source CSV and mapping you name. It writes results to your chosen output directory.</p><p>The CLI has no telemetry and makes no network requests.</p>
      <h2>What the website stores</h2><p>The demo uses bundled sample data and stores nothing. A pasted license is stored in this browser under <code>sb_license:import-mapping-replay</code>.</p><p>The site sends that license only to the Sociobot verification endpoint. The cached result is checked at most once each day.</p>
      <h2>What billing handles</h2><p>Sociobot and Dodo handle checkout, payment details, refunds, and licenses. This site does not receive card details.</p>
      <h2>Remove stored data</h2><p>Clear this site’s browser storage to remove the license and cached result.</p><p>Last updated: 28 August 2026.</p>
    </div></section>
  </main>${footer}`;

const terms = `
  ${header('/terms')}
  <main id="main" tabindex="-1" class="content-page">
    <section class="page-hero"><div class="section-inner"><p class="eyebrow">Terms</p><h1 id="page-title" tabindex="-1">Use replay files before uploading</h1><p class="lede">Review every result before sending data to another product.</p></div></section>
    <section class="section"><div class="section-inner prose">
      <h2>Local utility</h2><p>Import Mapping Replay transforms files you provide. You remain responsible for the source data, mapping, and final upload.</p>
      <h2>Rollback scope</h2><p>The rollback manifest preserves source rows from one local run. It cannot delete or change records in another product.</p>
      <h2>Team kit purchase</h2><p>The team kit costs £24 as a one-time purchase. The license covers one buyer and their internal implementation team.</p><p>Sociobot and Dodo are the merchant of record. They handle payment and refund requests.</p>
      <h2>Software terms</h2><p>The CLI is provided under the MIT License. The software is provided without warranty, as the license explains.</p><p>Last updated: 28 August 2026.</p>
    </div></section>
  </main>${footer}`;

const notFound = `
  ${header('/404')}
  <main id="main" tabindex="-1" class="content-page">
    <section class="page-hero"><div class="section-inner"><p class="eyebrow">Route not found</p><h1 id="page-title" tabindex="-1">This mapping line ends here</h1><p class="lede">The page address does not match a route.</p><a class="button" href="/" data-link>Return home</a></div></section>
  </main>${footer}`;

const routeData: Record<Route, { html: string; title: string; description: string }> = {
  '/': { html: landing, title: 'Import Mapping Replay — replay CSV mappings', description: 'Replay local CSV mappings with field-level evidence, validation results, and untouched source rows.' },
  '/demo': { html: demo, title: 'Demo — Import Mapping Replay', description: 'Review the bundled customer CSV replay and three validation errors.' },
  '/privacy': { html: privacy, title: 'Privacy — Import Mapping Replay', description: 'How Import Mapping Replay keeps customer CSV files local and handles licenses.' },
  '/terms': { html: terms, title: 'Terms — Import Mapping Replay', description: 'Terms for the Import Mapping Replay CLI and team mapping kit.' },
  '/404': { html: notFound, title: 'Page not found — Import Mapping Replay', description: 'The requested Import Mapping Replay page was not found.' },
};

let terminalTimers: number[] = [];

function currentRoute(): Route {
  if (location.pathname === '/' && new URLSearchParams(location.search).get('demo') === '1') return '/demo';
  return Object.hasOwn(routeData, location.pathname) ? location.pathname as Route : '/404';
}

function stopTerminal(): void {
  terminalTimers.forEach(window.clearTimeout);
  terminalTimers = [];
}

function replayTerminal(): void {
  stopTerminal();
  const output = document.querySelector<HTMLElement>('#terminal-output');
  if (!output) return;
  const lines = sampleTranscript.split('\n');
  output.innerHTML = '';
  lines.forEach((line, index) => {
    terminalTimers.push(window.setTimeout(() => {
      output.innerHTML += `${line}\n`;
    }, index * 105));
  });
}

function downloadKit(): void {
  const kit = {
    schema: 'import-mapping-replay/team-kit/v1',
    review: ['Confirm source hash', 'Resolve validation errors', 'Ask a second engineer to approve', 'Record upload owner'],
    recipes: ['email-normalisation', 'iso-date', 'plan-enum', 'stable-external-id', 'blank-default'],
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(kit, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'import-mapping-replay-team-kit.json';
  link.click();
  URL.revokeObjectURL(url);
}

function setLicenseState(valid: boolean, message: string): void {
  const status = document.querySelector<HTMLElement>('#license-status');
  const panel = document.querySelector<HTMLElement>('#kit-panel');
  if (status) status.textContent = message;
  if (panel) panel.hidden = !valid;
}

async function verifyLicense(token: string, force = false): Promise<void> {
  if (!token) return;
  const cached = JSON.parse(localStorage.getItem(VERDICT_KEY) || 'null') as { valid: boolean; checked: number } | null;
  const fresh = cached && Date.now() - cached.checked < 86_400_000;
  if (cached?.valid) setLicenseState(true, 'License active. The team kit is ready.');
  if (fresh && !force) return;
  setLicenseState(Boolean(cached?.valid), 'Checking the license…');
  try {
    const response = await fetch(`${BILLING}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('verification unavailable');
    const result = await response.json() as { valid: boolean };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: result.valid, checked: Date.now() }));
    setLicenseState(result.valid, result.valid ? 'License active. The team kit is ready.' : 'License no longer active. Check the token or buy the team kit.');
  } catch {
    setLicenseState(Boolean(cached?.valid), cached?.valid ? 'Using the last valid check while verification is unavailable.' : 'The license could not be checked. Check your connection and try again.');
  }
}

function processReturnedLicense(): void {
  if (currentRoute() === '/demo') return;
  const params = new URLSearchParams(location.search);
  const token = params.get('license');
  if (!token) return;
  localStorage.setItem(LICENSE_KEY, token);
  params.delete('license');
  const query = params.toString();
  history.replaceState({}, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
}

function bindPage(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const url = new URL(link.href);
      if (url.origin !== location.origin) return;
      event.preventDefault();
      history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
      render(true);
    });
  });
  document.querySelector('#replay-terminal')?.addEventListener('click', replayTerminal);
  document.querySelector('#reset-demo')?.addEventListener('click', () => {
    stopTerminal();
    const output = document.querySelector<HTMLElement>('#terminal-output');
    if (output) output.innerHTML = sampleTranscript;
    document.querySelector<HTMLElement>('#result-title')?.focus();
  });
  document.querySelector('#license-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.querySelector<HTMLInputElement>('#license');
    const token = input?.value.trim() || '';
    if (!token) { setLicenseState(false, 'Paste a license token, then verify it.'); return; }
    localStorage.setItem(LICENSE_KEY, token);
    void verifyLicense(token, true);
  });
  document.querySelector('#download-kit')?.addEventListener('click', downloadKit);
  if (currentRoute() === '/') {
    const stored = localStorage.getItem(LICENSE_KEY);
    if (stored) void verifyLicense(stored);
  }
}

function render(moveFocus = false): void {
  stopTerminal();
  const route = currentRoute();
  const page = routeData[route];
  const app = document.querySelector<HTMLElement>('#app');
  if (!app) return;
  app.innerHTML = page.html;
  document.title = page.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', page.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://import-mapping-replay.sociobot.in${route === '/404' ? '/404' : route}`);
  bindPage();
  const hashTarget = location.hash ? document.querySelector<HTMLElement>(location.hash) : null;
  requestAnimationFrame(() => {
    if (hashTarget) hashTarget.scrollIntoView();
    else window.scrollTo(0, 0);
    if (moveFocus) {
      document.querySelector<HTMLElement>('#page-title')?.focus({ preventScroll: Boolean(hashTarget) });
    }
    const status = document.querySelector<HTMLElement>('#route-status');
    if (status) status.textContent = page.title;
  });
}

processReturnedLicense();
document.querySelector<HTMLAnchorElement>('.skip-link')?.addEventListener('click', (event) => {
  event.preventDefault();
  const main = document.querySelector<HTMLElement>('#main');
  main?.focus();
  main?.scrollIntoView();
});
window.addEventListener('popstate', () => render(true));
window.addEventListener('offline', () => {
  const status = document.querySelector<HTMLElement>('#route-status');
  if (status) status.textContent = 'The site is offline. The installed CLI still runs locally.';
});
render();
