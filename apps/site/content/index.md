---
title: REALM
description: REALM is an HTML framework for shipping MVPs. Write web components in plain HTML, load REALM from a CDN and use them on any server-rendered page.
layout: home
---

<section class="hero">
  <realm-logo size="72"></realm-logo>
  <h1>The HTML framework for shipping MVPs</h1>
  <p class="lead">REALM turns a <code>&lt;custom-element&gt;</code> tag into a <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components" rel="noopener">native web component</a> in the browser. Write the script, style and markup in plain HTML, load REALM from a CDN and open the file. There is no build step.</p>
  <div class="actions">
    <a class="action primary" href="{{root}}docs/quick-start/">Get started <u-icon name="arrow-right"></u-icon></a>
    <a class="action outline" href="{{root}}examples/"><u-icon name="layout-grid"></u-icon> Examples</a>
  </div>
  <p class="hero-note"><u-icon name="code-xml" aria-hidden="true"></u-icon><span>This whole page is made of web components. Inspect any element to see them.</span></p>
</section>

<section class="home-section major" aria-labelledby="write-a-component">
<header class="section-head">
<span class="section-icon"><u-icon name="code-xml" aria-hidden="true"></u-icon></span>
<h2 id="write-a-component">Write a web component in plain HTML</h2>
<p class="section-lead">A REALM component is one <code>&lt;custom-element&gt;</code> tag that holds a script, a style and markup. Values appear through native <code>&lt;slot&gt;</code> tags and events use plain <code>onclick</code>. The code on the left is the whole page.</p>
</header>

```html live split
<custom-element name="click-counter">
  <script type="realm">
    const props = defineProps({ step: prop.number().int().min(1).default(1) });

    const counter = useState({
      count: 0,
      get unit() {
        return this.count === 1 ? "time" : "times";
      },
    });

    function increment() {
      counter.count += props.step;
    }

    function reset() {
      counter.count = 0;
    }
  </script>

  <style type="realm">
    :host {
      display: inline-flex;
      gap: calc(var(--spacing) * 2);
    }
  </style>

  <ui-button onclick="increment()">Clicked <slot name="#counter.count"></slot> <slot name="#counter.unit"></slot></ui-button>
  <ui-button variant="outline" onclick="reset()">Reset</ui-button>
</custom-element>

<click-counter></click-counter>
<click-counter step="5"></click-counter>
```

</section>

<section class="home-section" aria-labelledby="state-and-data">
<header class="section-head">
<span class="section-icon"><u-icon name="mouse-pointer-click" aria-hidden="true"></u-icon></span>
<h2 id="state-and-data">State, lists, data and forms</h2>
<p class="section-lead"><code>useState</code> returns a plain object. Change it and only the slots and attributes that read it update. Requests, forms and component files work through HTML attributes and tags.</p>
</header>
<ui-tabs value="state" class="demo-tabs">
<ui-tabs-list aria-label="Examples">
<ui-tabs-trigger value="state"><u-icon name="list-checks" aria-hidden="true"></u-icon>State</ui-tabs-trigger>
<ui-tabs-trigger value="fetch"><u-icon name="cloud-download" aria-hidden="true"></u-icon>Fetch</ui-tabs-trigger>
<ui-tabs-trigger value="forms"><u-icon name="send" aria-hidden="true"></u-icon>Forms</ui-tabs-trigger>
<ui-tabs-trigger value="files"><u-icon name="file-code-2" aria-hidden="true"></u-icon>Files</ui-tabs-trigger>
</ui-tabs-list>
<ui-tabs-content value="state">
<p class="demo-note"><code>repeat</code> renders one row per item. Getters such as <code>left</code> recompute when the data they read changes.</p>

```html live split
<custom-element name="todo-list">
  <script type="realm">
    const todos = useState({
      items: [
        { id: 1, text: "Write a component", done: true },
        { id: 2, text: "Ship the MVP", done: false },
      ],
      draft: "",
      get left() {
        return `${this.items.filter((item) => !item.done).length} left`;
      },
    });

    function add(event) {
      event.preventDefault();
      const text = todos.draft.trim();
      if (!text) return;
      todos.items.push({ id: Date.now(), text, done: false });
      todos.draft = "";
    }

    function updateDraft(field) {
      todos.draft = field.value;
    }

    function toggle(item) {
      item.done = !item.done;
    }

    function remove(item) {
      todos.items.splice(todos.items.indexOf(item), 1);
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      width: min(calc(var(--spacing) * 96), 100%);
    }
    form {
      display: flex;
      gap: calc(var(--spacing) * 2);
    }
    form ui-input {
      flex: 1;
    }
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 3);
      padding: calc(var(--spacing) * 1) 0;
    }
    li span {
      flex: 1;
    }
    li[data-done] span {
      color: var(--muted-foreground);
      text-decoration: line-through;
    }
    small {
      color: var(--muted-foreground);
    }
  </style>

  <form onsubmit="add(event)">
    <ui-input aria-label="New todo" placeholder="What needs doing?" _value="#todos.draft" oninput="updateDraft(this)"></ui-input>
    <ui-button type="submit">Add</ui-button>
  </form>
  <ul>
    <li repeat="#todos.items" as="item" key="id" _data-done="#item.done">
      <ui-checkbox _aria-label="#item.text" _checked="#item.done" onchange="toggle(item)"></ui-checkbox>
      <span><slot name="#item.text"></slot></span>
      <ui-button variant="ghost" size="sm" onclick="remove(item)">Remove</ui-button>
    </li>
  </ul>
  <small><slot name="#todos.left"></slot></small>
</custom-element>

<todo-list></todo-list>
```

</ui-tabs-content>
<ui-tabs-content value="fetch">
<p class="demo-note"><code>fetch</code> names the URL, <code>into</code> names the state that receives the JSON and <code>busy</code> tracks loading. The script only declares the state.</p>

```html live split
<custom-element name="book-shelf">
  <script type="realm">
    const shelf = useState({ books: [], loading: false });
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 3);
      justify-items: start;
      width: min(calc(var(--spacing) * 96), 100%);
    }
    ul {
      margin: 0;
      padding-left: calc(var(--spacing) * 5);
    }
    span {
      color: var(--muted-foreground);
    }
  </style>

  <ui-button fetch="{{root}}demos/books.json" into="#shelf.books" busy="#shelf.loading" _disabled="#shelf.loading">Load books</ui-button>
  <is-visible when="#shelf.loading"><ui-spinner></ui-spinner></is-visible>
  <ul>
    <li repeat="#shelf.books" as="book" key="id"><slot name="#book.title"></slot> <span>by <slot name="#book.author"></slot></span></li>
  </ul>
</custom-element>

<book-shelf></book-shelf>
```

</ui-tabs-content>
<ui-tabs-content value="forms">
<p class="demo-note">REALM components are form fields. They submit, reset and validate with their <code>&lt;form&gt;</code>, so <code>FormData</code> is all you need.</p>

```html live split
<custom-element name="signup-form">
  <script type="realm">
    const result = useState({ text: "Submit the form to see what it sends." });

    function submit(event) {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target));
      result.text = JSON.stringify(data, null, 2);
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 4);
      width: min(calc(var(--spacing) * 96), 100%);
    }
    form {
      display: grid;
      gap: calc(var(--spacing) * 4);
    }
    pre {
      margin: 0;
      padding: calc(var(--spacing) * 3);
      border-radius: var(--radius-md);
      background: var(--muted);
      font-size: var(--text-sm);
    }
  </style>

  <form onsubmit="submit(event)">
    <ui-field>
      <ui-label for="signup-email">Email</ui-label>
      <ui-input id="signup-email" name="email" type="email" required placeholder="you@example.com"></ui-input>
    </ui-field>
    <ui-select name="plan" aria-label="Plan">
      <option value="free">Free</option>
      <option value="team">Team</option>
    </ui-select>
    <ui-switch name="updates" checked>Send me product updates</ui-switch>
    <ui-button type="submit">Sign up</ui-button>
  </form>
  <pre><slot name="#result.text"></slot></pre>
</custom-element>

<signup-form></signup-form>
```

</ui-tabs-content>
<ui-tabs-content value="files">
<p class="demo-note">Keep each component in its own HTML file and load it with <code>&lt;import-element&gt;</code>. The file is fetched once and parsed, never run as a script. Open the <code>profile-card.html</code> tab to see it.</p>

```html live split
<import-element from="{{root}}demos/profile-card.html"></import-element>

<div class="demo-narrow demo-stack">
  <profile-card name="Ada Lovelace" job="Mathematician"></profile-card>
  <profile-card name="Alan Turing" job="Computer scientist"></profile-card>
</div>
```

</ui-tabs-content>
</ui-tabs>
</section>

<section class="home-section major" aria-labelledby="server-rendered-html">
<header class="section-head">
<span class="section-icon"><u-icon name="server" aria-hidden="true"></u-icon></span>
<h2 id="server-rendered-html">Server-rendered HTML that search engines can read</h2>
<p class="section-lead">Your server sends the page as ordinary HTML, so titles, text, links and meta tags are all in the first response. Search engines and AI crawlers index it without running JavaScript, and REALM upgrades the custom tags into components in the browser. There is no hydration step and no JavaScript server to run.</p>
</header>
<ul class="backends" aria-label="Server-side stacks">
<li><u-icon set="si" name="php" aria-hidden="true"></u-icon>PHP</li>
<li><u-icon set="si" name="rubyonrails" aria-hidden="true"></u-icon>Rails</li>
<li><u-icon set="si" name="django" aria-hidden="true"></u-icon>Django</li>
<li><u-icon set="si" name="go" aria-hidden="true"></u-icon>Go</li>
<li><u-icon set="si" name="nodedotjs" aria-hidden="true"></u-icon>Node.js</li>
<li><u-icon set="si" name="hugo" aria-hidden="true"></u-icon>Hugo</li>
</ul>
<div class="ssr">
<figure class="ssr-pane">
<figcaption>Your server template</figcaption>
<ui-tabs value="php">
<ui-tabs-list aria-label="Server templates">
<ui-tabs-trigger value="php">faq.php</ui-tabs-trigger>
<ui-tabs-trigger value="erb">faq.html.erb</ui-tabs-trigger>
<ui-tabs-trigger value="django">faq.html</ui-tabs-trigger>
<ui-tabs-trigger value="go">faq.tmpl</ui-tabs-trigger>
</ui-tabs-list>
<ui-tabs-content value="php">

```html
<import-element from="https://realm.js.org/dist/ui/components/accordion.html"></import-element>

<ui-accordion>
  <?php foreach ($faqs as $faq): ?>
    <ui-accordion-item>
      <ui-accordion-trigger><?= htmlspecialchars($faq->question) ?></ui-accordion-trigger>
      <ui-accordion-content><?= htmlspecialchars($faq->answer) ?></ui-accordion-content>
    </ui-accordion-item>
  <?php endforeach ?>
</ui-accordion>
```

</ui-tabs-content>
<ui-tabs-content value="erb">

```html
<import-element from="https://realm.js.org/dist/ui/components/accordion.html"></import-element>

<ui-accordion>
  <% @faqs.each do |faq| %>
    <ui-accordion-item>
      <ui-accordion-trigger><%= faq.question %></ui-accordion-trigger>
      <ui-accordion-content><%= faq.answer %></ui-accordion-content>
    </ui-accordion-item>
  <% end %>
</ui-accordion>
```

</ui-tabs-content>
<ui-tabs-content value="django">

```html
<import-element from="https://realm.js.org/dist/ui/components/accordion.html"></import-element>

<ui-accordion>
  {% for faq in faqs %}
    <ui-accordion-item>
      <ui-accordion-trigger>{{ faq.question }}</ui-accordion-trigger>
      <ui-accordion-content>{{ faq.answer }}</ui-accordion-content>
    </ui-accordion-item>
  {% endfor %}
</ui-accordion>
```

</ui-tabs-content>
<ui-tabs-content value="go">

```html
<import-element from="https://realm.js.org/dist/ui/components/accordion.html"></import-element>

<ui-accordion>
  {{range .FAQs}}
    <ui-accordion-item>
      <ui-accordion-trigger>{{.Question}}</ui-accordion-trigger>
      <ui-accordion-content>{{.Answer}}</ui-accordion-content>
    </ui-accordion-item>
  {{end}}
</ui-accordion>
```

</ui-tabs-content>
</ui-tabs>
</figure>
<figure class="ssr-pane">
<figcaption>What the browser shows</figcaption>

```html live
<div class="demo-medium">
  <ui-accordion>
    <ui-accordion-item open>
      <ui-accordion-trigger>Does REALM need a build step?</ui-accordion-trigger>
      <ui-accordion-content>No. Load it from a CDN and write each component in an HTML file.</ui-accordion-content>
    </ui-accordion-item>
    <ui-accordion-item>
      <ui-accordion-trigger>Can search engines read these answers?</ui-accordion-trigger>
      <ui-accordion-content>Yes. Every question and answer is text in the page's HTML. The accordion only adds opening and closing.</ui-accordion-content>
    </ui-accordion-item>
    <ui-accordion-item>
      <ui-accordion-trigger>Which servers does it work with?</ui-accordion-trigger>
      <ui-accordion-content>Any server that sends HTML: PHP, Rails, Django, Go, Node.js or a static site generator.</ui-accordion-content>
    </ui-accordion-item>
  </ui-accordion>
</div>
```

</figure>
</div>
<div class="seo">
<figure class="ssr-pane">
<figcaption>What a crawler receives</figcaption>

```html
<head>
  <title>FAQ · Acme</title>
  <meta name="description" content="Answers about Acme.">
</head>
<body>
  <ui-accordion>
    <ui-accordion-item>
      <ui-accordion-trigger>Does REALM need a build step?</ui-accordion-trigger>
      <ui-accordion-content>No. Load it from a CDN and write each component in an HTML file.</ui-accordion-content>
    </ui-accordion-item>
    <ui-accordion-item>
      <ui-accordion-trigger>Can search engines read these answers?</ui-accordion-trigger>
      <ui-accordion-content>Yes. Every question and answer is text in the page's HTML.</ui-accordion-content>
    </ui-accordion-item>
  </ui-accordion>
</body>
```

</figure>
<ul class="seo-points">
<li><u-icon name="search" aria-hidden="true"></u-icon><strong>Indexed from the first response</strong><span>Compound parts hold their content as ordinary child elements, so every question and answer is in the HTML a search engine fetches.</span></li>
<li><u-icon name="bot" aria-hidden="true"></u-icon><strong>Readable by AI crawlers</strong><span>Many AI crawlers do not run JavaScript. They read the same text, because it never depended on a script.</span></li>
<li><u-icon name="layers" aria-hidden="true"></u-icon><strong>Nothing to hydrate</strong><span>The server's markup is the final markup. REALM attaches behaviour to it in place, with no second render and no state payload.</span></li>
<li><u-icon name="share-2" aria-hidden="true"></u-icon><strong>Link previews from your server</strong><span>The title, description and Open Graph tags are server output, so shared links unfurl with the right card.</span></li>
</ul>
</div>
<p class="ssr-note"><u-icon name="info" aria-hidden="true"></u-icon><span>Put content in compound parts and search engines index it. What a component draws inside its own shadow root is not in the HTML, because REALM does not output Declarative Shadow DOM.</span></p>
</section>

<section class="home-section" aria-labelledby="ui-kit">
<header class="section-head">
<span class="section-icon"><u-icon name="blocks" aria-hidden="true"></u-icon></span>
<h2 id="ui-kit">Sixty UI components and 50,939 icons</h2>
<p class="section-lead">REALM UI has about sixty accessible <code>ui-*</code> components: buttons, forms, dialogs, menus, tabs, tables and charts. Import one file and use the tags. Dark mode and theming come from CSS variables.</p>
</header>

```html live split
<div class="demo-narrow">
  <ui-card>
    <ui-card-header>
      <ui-card-title>Launch your MVP</ui-card-title>
      <ui-card-description>Every control here is a ui-* tag.</ui-card-description>
      <ui-card-action><ui-badge variant="secondary">Beta</ui-badge></ui-card-action>
    </ui-card-header>
    <ui-card-content class="demo-stack">
      <ui-field>
        <ui-label for="launch-name">Project name</ui-label>
        <ui-input id="launch-name" placeholder="my-first-mvp"></ui-input>
      </ui-field>
      <ui-switch checked>Email me when it is live</ui-switch>
    </ui-card-content>
    <ui-card-footer justify="between">
      <ui-button variant="outline">Cancel</ui-button>
      <ui-button onclick="document.dispatchEvent(new CustomEvent('toast', { detail: { title: 'Launched', description: 'Your MVP is live.' } }))">Launch</ui-button>
    </ui-card-footer>
  </ui-card>
</div>
```

<div class="icon-strip" aria-labelledby="icons">
<div>
<h3 id="icons">Icons from 31 sets in one tag</h3>
<p>Unicons gives you 50,939 icons through <code>&lt;u-icon name="heart" set="tb"&gt;</code>. Each page downloads only the icons it uses. <a href="{{root}}unicons/">Browse the catalog <u-icon name="arrow-right" aria-hidden="true"></u-icon></a></p>
</div>
<div class="icon-row">
<u-icon name="heart" size="32"></u-icon>
<u-icon set="tb" name="heart-filled" size="32" color="crimson"></u-icon>
<u-icon set="pi" name="heart" size="32"></u-icon>
<u-icon set="fa6" name="rocket" size="32"></u-icon>
<u-icon set="bi" name="rocket" size="32" color="rebeccapurple"></u-icon>
<u-icon name="rocket" size="32" stroke-width="1"></u-icon>
</div>
</div>
</section>

<section class="home-section" aria-labelledby="platform">
<header class="section-head">
<span class="section-icon"><u-icon name="globe" aria-hidden="true"></u-icon></span>
<h2 id="platform">Built on browser features, with no dependencies</h2>
<p class="section-lead">The REALM runtime is 16 KB gzipped and depends on nothing. Each UI component wraps a feature the browser already ships, so focus, layering, keyboard and forms behave like built-in elements. Try them.</p>
</header>
<div class="platform-grid">
<figure class="platform-tile">
<div class="platform-stage">
<ui-dialog>
  <ui-dialog-trigger><ui-button variant="outline">Open dialog</ui-button></ui-dialog-trigger>
  <ui-dialog-header>
    <ui-dialog-title>A native dialog</ui-dialog-title>
    <ui-dialog-description>Press Escape or click outside to close it. Focus goes back to the button.</ui-dialog-description>
  </ui-dialog-header>
  <ui-dialog-footer>
    <ui-dialog-close><ui-button>Close</ui-button></ui-dialog-close>
  </ui-dialog-footer>
</ui-dialog>
</div>
<figcaption>
<p class="platform-map"><code>&lt;ui-dialog&gt;</code><u-icon name="arrow-right" role="img" aria-label="uses"></u-icon><code>&lt;dialog&gt;</code></p>
<p>Top layer, focus moves in, Escape closes.</p>
</figcaption>
</figure>
<figure class="platform-tile">
<div class="platform-stage">
<ui-popover>
  <ui-popover-trigger><ui-button variant="outline">Open popover</ui-button></ui-popover-trigger>
  <ui-popover-content width="56">Click anywhere outside to close it.</ui-popover-content>
</ui-popover>
</div>
<figcaption>
<p class="platform-map"><code>&lt;ui-popover&gt;</code><u-icon name="arrow-right" role="img" aria-label="uses"></u-icon><code>popover</code></p>
<p>The Popover API: no z-index fights, light dismiss.</p>
</figcaption>
</figure>
<figure class="platform-tile">
<div class="platform-stage">
<form class="platform-form" onsubmit="event.preventDefault(); this.reset()">
  <ui-input name="email" type="email" required placeholder="you@example.com" aria-label="Email"></ui-input>
  <ui-button type="submit">Send</ui-button>
</form>
</div>
<figcaption>
<p class="platform-map"><code>&lt;ui-input&gt;</code><u-icon name="arrow-right" role="img" aria-label="uses"></u-icon><code>ElementInternals</code></p>
<p>Submit it empty and the browser checks it.</p>
</figcaption>
</figure>
<figure class="platform-tile">
<div class="platform-stage">
<ui-select aria-label="Engine">
  <option value="blink">Chromium</option>
  <option value="gecko">Firefox</option>
  <option value="webkit">WebKit</option>
</ui-select>
</div>
<figcaption>
<p class="platform-map"><code>&lt;ui-select&gt;</code><u-icon name="arrow-right" role="img" aria-label="uses"></u-icon><code>&lt;select&gt;</code></p>
<p>Plain <code>&lt;option&gt;</code> tags and the native picker.</p>
</figcaption>
</figure>
<figure class="platform-tile">
<div class="platform-stage">
<ui-toggle-group type="multiple" value="bold" aria-label="Text formatting">
  <ui-toggle value="bold" variant="outline" aria-label="Bold"><u-icon name="bold"></u-icon></ui-toggle>
  <ui-toggle value="italic" variant="outline" aria-label="Italic"><u-icon name="italic"></u-icon></ui-toggle>
  <ui-toggle value="underline" variant="outline" aria-label="Underline"><u-icon name="underline"></u-icon></ui-toggle>
</ui-toggle-group>
</div>
<figcaption>
<p class="platform-map"><code>&lt;ui-toggle-group&gt;</code><u-icon name="arrow-right" role="img" aria-label="uses"></u-icon><code>focusgroup</code></p>
<p>Tab in once, then arrow keys move between buttons.</p>
</figcaption>
</figure>
<figure class="platform-tile">
<div class="platform-stage">
<ui-switch checked>Email updates</ui-switch>
</div>
<figcaption>
<p class="platform-map"><code>&lt;ui-switch&gt;</code><u-icon name="arrow-right" role="img" aria-label="uses"></u-icon><code>:state(attr-checked)</code></p>
<p>CustomStateSet: style it like a native pseudo-class.</p>
</figcaption>
</figure>
</div>
<dl class="facts">
<div><dt><u-icon name="file-archive" aria-hidden="true"></u-icon>16 KB</dt><dd>runtime, gzipped</dd></div>
<div><dt><u-icon name="package" aria-hidden="true"></u-icon>0</dt><dd>dependencies</dd></div>
<div><dt><u-icon name="shield-check" aria-hidden="true"></u-icon>100%</dt><dd>test coverage</dd></div>
<div class="facts-browsers">
<dt>
<ul class="engines" aria-label="Supported browsers">
<li><u-icon set="ri" name="chrome-fill" aria-hidden="true"></u-icon>Chrome</li>
<li><u-icon set="ri" name="edge-new-fill" aria-hidden="true"></u-icon>Edge</li>
<li><u-icon set="ri" name="firefox-browser-fill" aria-hidden="true"></u-icon>Firefox</li>
<li><u-icon set="ri" name="safari-fill" aria-hidden="true"></u-icon>Safari</li>
</ul>
</dt>
<dd>Tested in every major browser and engine. <a href="{{root}}docs/browser-support/">Browser support</a></dd>
</div>
</dl>
</section>

<section class="home-section major" aria-labelledby="coding-assistants">
<header class="section-head">
<span class="section-icon"><u-icon name="bot" aria-hidden="true"></u-icon></span>
<h2 id="coding-assistants">Build with ChatGPT, Claude or Gemini</h2>
<p class="section-lead">A REALM component is one HTML file with native tags, a script and a style. There is no JSX and no compiled output for a model to reason about, and the REALM Agent Skill gives your coding assistant the rules.</p>
</header>
<div class="assist">
<div class="assist-start">
<ul class="assistants" aria-label="Coding assistants">
<li><u-icon set="ri" name="openai-fill" aria-hidden="true"></u-icon>ChatGPT</li>
<li><u-icon set="ri" name="claude-fill" aria-hidden="true"></u-icon>Claude</li>
<li><u-icon set="ri" name="gemini-fill" aria-hidden="true"></u-icon>Gemini</li>
</ul>
<div class="session" role="group" aria-label="Example session">
<p><span class="session-mark" aria-hidden="true">$</span><code>npx skills add realmorg/realm</code></p>
<p class="session-note"><span class="session-mark" aria-hidden="true">#</span><span>installs the REALM Agent Skill from the realmorg/realm repository on GitHub, or <a href="{{root}}skills/realm.zip" download>download realm.zip</a></span></p>
<p class="session-prompt"><span class="session-mark" aria-hidden="true">&gt;</span>Add a pricing table with REALM UI to index.html</p>
</div>
</div>
<ul class="assist-reasons">
<li><u-icon name="file-code-2" aria-hidden="true"></u-icon><strong>One file per component</strong><span>Script, style and markup sit together, so a model reads the whole component at once.</span></li>
<li><u-icon name="code-xml" aria-hidden="true"></u-icon><strong>Native tags, nothing compiled</strong><span>What the model writes is what the browser runs. View Source shows the same code.</span></li>
<li><u-icon name="file-text" aria-hidden="true"></u-icon><strong>Docs as Markdown</strong><span>Add <code>.md</code> to any docs address. <code>llms.txt</code> and <code>llms-full.txt</code> list every page.</span></li>
<li><u-icon name="list-checks" aria-hidden="true"></u-icon><strong>Rules with tests</strong><span>Behaviour is written as specs, and each rule has a test with the same name.</span></li>
</ul>
</div>
<p class="assist-caption">The kind of file that comes back. It is plain HTML and it runs right here.</p>

```html live split
<custom-element name="pricing-table">
  <script type="realm">
    const pricing = useState({
      yearly: false,
      get price() {
        return this.yearly ? "$190" : "$19";
      },
      get period() {
        return this.yearly ? "per year" : "per month";
      },
    });

    function setBilling(group) {
      pricing.yearly = group.value === "yearly";
    }
  </script>

  <style type="realm">
    :host {
      display: grid;
      gap: calc(var(--spacing) * 4);
      justify-items: center;
      width: min(calc(var(--spacing) * 128), 100%);
    }
    .plans {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(calc(var(--spacing) * 52), 1fr));
      gap: calc(var(--spacing) * 4);
      width: 100%;
    }
    strong {
      font-size: var(--text-3xl);
    }
    small {
      color: var(--muted-foreground);
    }
  </style>

  <ui-toggle-group value="monthly" aria-label="Billing" onchange="setBilling(this)">
    <ui-toggle value="monthly" variant="outline">Monthly</ui-toggle>
    <ui-toggle value="yearly" variant="outline">Yearly</ui-toggle>
  </ui-toggle-group>
  <div class="plans">
    <ui-card>
      <ui-card-header>
        <ui-card-title>Hobby</ui-card-title>
        <ui-card-description>One project, forever.</ui-card-description>
      </ui-card-header>
      <ui-card-content><strong>$0</strong> <small>free</small></ui-card-content>
      <ui-card-footer><ui-button variant="outline">Start free</ui-button></ui-card-footer>
    </ui-card>
    <ui-card>
      <ui-card-header>
        <ui-card-title>Team</ui-card-title>
        <ui-card-description>Unlimited projects.</ui-card-description>
        <ui-card-action><ui-badge>Popular</ui-badge></ui-card-action>
      </ui-card-header>
      <ui-card-content><strong><slot name="#pricing.price"></slot></strong> <small><slot name="#pricing.period"></slot></small></ui-card-content>
      <ui-card-footer><ui-button>Start a trial</ui-button></ui-card-footer>
    </ui-card>
  </div>
</custom-element>

<pricing-table></pricing-table>
```

<ul class="assist-links">
<li><a href="{{root}}docs/ai-skill/"><u-icon name="book-open" aria-hidden="true"></u-icon>Agent Skill guide</a></li>
<li><a href="{{root}}llms.txt"><u-icon name="file-text" aria-hidden="true"></u-icon>llms.txt</a></li>
<li><a href="{{root}}llms-full.txt"><u-icon name="files" aria-hidden="true"></u-icon>llms-full.txt</a></li>
<li><a href="https://github.com/realmorg/realm/tree/main/openspec/specs" rel="noopener" target="_blank"><u-icon name="github" aria-hidden="true"></u-icon>Specs on GitHub</a></li>
</ul>
</section>

<section class="home-section" aria-labelledby="examples">
<header class="section-head">
<span class="section-icon"><u-icon name="layout-grid" aria-hidden="true"></u-icon></span>
<h2 id="examples">Apps built with REALM</h2>
<p class="section-lead">Complete apps that run on this site. Each is a few HTML files and small JavaScript modules, so View Source shows the whole app.</p>
</header>
<div class="card-grid">
<a class="link-card" href="{{root}}examples/todo/"><u-icon name="list-todo"></u-icon><strong>Todo</strong><span>A persisted store, filters, keyed rows and inline editing.</span></a>
<a class="link-card" href="{{root}}examples/kanban/"><u-icon name="square-kanban"></u-icon><strong>Kanban board</strong><span>Native drag and drop, keyboard moves and a card editor.</span></a>
<a class="link-card" href="{{root}}examples/chess/"><u-icon name="crown"></u-icon><strong>Chess</strong><span>Legal moves, check and mate, and a computer opponent.</span></a>
<a class="link-card" href="{{root}}examples/dashboard/"><u-icon name="layout-dashboard"></u-icon><strong>Dashboard</strong><span>Sidebar, charts, a data table and a command palette.</span></a>
<a class="link-card" href="{{root}}examples/weather/"><u-icon name="cloud-sun"></u-icon><strong>Weather</strong><span>City search and a forecast loaded with fetch attributes.</span></a>
<a class="link-card" href="{{root}}examples/contacts/"><u-icon name="contact"></u-icon><strong>Contacts</strong><span>Create, edit and delete records over a JSON API.</span></a>
</div>
<p class="more"><a href="{{root}}examples/">All examples <u-icon name="arrow-right"></u-icon></a></p>
</section>

<section class="cta" aria-labelledby="start">
<h2 id="start">Start with one HTML file</h2>
<p>Add these two tags to any page. There is no npm install, no bundler and no config file, and View Source shows the code you wrote.</p>
<div class="cta-code">

```html
<link rel="stylesheet" href="https://realm.js.org/dist/realm.css">
<script type="module" src="https://realm.js.org/dist/realm.js"></script>
```

</div>
<div class="actions">
<a class="action primary" href="{{root}}docs/quick-start/">Read the quick start <u-icon name="arrow-right"></u-icon></a>
<a class="action outline" href="{{root}}docs/tutorial/"><u-icon name="book-open"></u-icon> Follow the tutorial</a>
</div>
</section>
