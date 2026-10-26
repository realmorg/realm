import { describe, expect, test } from "vitest";
import { part, render, shadow, tick } from "./setup";

const internalsOf = new WeakMap<Element, ElementInternals>();
const attachInternals = HTMLElement.prototype.attachInternals;
HTMLElement.prototype.attachInternals = function (this: HTMLElement) {
  const internals = attachInternals.call(this);
  internalsOf.set(this, internals);
  return internals;
};

const box = (el: Element | null) => (el as Element).getBoundingClientRect();
const style = (el: Element | null) => getComputedStyle(el as Element);
const pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("card parts", () => {
  test("card header lays out title, description and action, and the title is a heading", async () => {
    const host = await render(`
      <div class="frame" style="width: 400px">
        <ui-card>
          <ui-card-header>
            <ui-card-title>Login</ui-card-title>
            <ui-card-description>Enter your email</ui-card-description>
            <ui-card-action><button>Sign up</button></ui-card-action>
          </ui-card-header>
          <ui-card-content>Body</ui-card-content>
          <ui-card-footer justify="between"><button>A</button><button>B</button></ui-card-footer>
        </ui-card>
      </div>`);
    const title = host.querySelector("ui-card-title");
    const heading = part(title, "title");
    expect(heading.role).toBe("heading");
    expect(heading.getAttribute("aria-level")).toBe("3");
    expect(heading.querySelector("slot")?.assignedNodes()[0]?.textContent).toBe("Login");
    const action = host.querySelector("ui-card-action");
    expect(box(action).left).toBeGreaterThan(box(title).right);
    expect(box(action).top).toBe(box(title).top);
    expect(box(host.querySelector("ui-card-description")).top).toBeGreaterThan(box(title).top);
    expect(box(host.querySelector("ui-card-content")).width).toBeGreaterThan(300);
    expect(style(host.querySelector("ui-card-footer")).justifyContent).toBe("space-between");
  });

  test("card title takes its heading level from the level attribute", async () => {
    const host = await render(`<ui-card-title level="1">Sign in</ui-card-title>`);
    const title = host.querySelector("ui-card-title") as HTMLElement;
    expect(part(title, "title").getAttribute("aria-level")).toBe("1");
    title.setAttribute("level", "2");
    await tick();
    expect(part(title, "title").getAttribute("aria-level")).toBe("2");
  });

  test("card footer ends or stacks its actions", async () => {
    const host = await render(`
      <ui-card-footer id="end" justify="end"></ui-card-footer>
      <ui-card-footer id="stack" orientation="vertical"></ui-card-footer>`);
    expect(style(host.querySelector("#end")).justifyContent).toBe("flex-end");
    expect(style(host.querySelector("#stack")).flexDirection).toBe("column");
  });
});

describe("alert and empty parts", () => {
  test("alert title and description sit beside the icon, and destructive tints the description", async () => {
    const host = await render(`
      <ui-alert variant="destructive">
        <svg viewBox="0 0 24 24"></svg>
        <ui-alert-title>Error</ui-alert-title>
        <ui-alert-description>Something failed.</ui-alert-description>
      </ui-alert>
      <ui-alert id="plain"><ui-alert-title>Note</ui-alert-title></ui-alert>`);
    const alert = host.querySelector("ui-alert") as Element;
    const icon = alert.querySelector("svg");
    const title = alert.querySelector("ui-alert-title");
    expect(box(title).left).toBeGreaterThan(box(icon).right);
    expect(box(alert.querySelector("ui-alert-description")).left).toBe(box(title).left);
    expect(style(alert.querySelector("ui-alert-description")).color).not.toBe(
      style(host.querySelector("#plain ui-alert-title")).color,
    );
    const plain = host.querySelector("#plain") as Element;
    expect(box(plain.querySelector("ui-alert-title")).left - box(plain).left).toBe(
      Number.parseFloat(style(plain).paddingLeft) + 1,
    );
  });

  test("empty renders header, icon media, heading title, description and content", async () => {
    const host = await render(`
      <ui-empty>
        <ui-empty-header>
          <ui-empty-media variant="icon"><svg viewBox="0 0 24 24"></svg></ui-empty-media>
          <ui-empty-title>No projects</ui-empty-title>
          <ui-empty-description>Create one.</ui-empty-description>
        </ui-empty-header>
        <ui-empty-content><button>New</button></ui-empty-content>
      </ui-empty>
      <ui-empty-media id="plain">📁</ui-empty-media>`);
    expect(part(host.querySelector("ui-empty-title"), "title").getAttribute("role")).toBe(
      "heading",
    );
    const media = host.querySelector("ui-empty-media") as Element;
    expect(box(media).width).toBe(40);
    expect(style(media).backgroundColor).not.toBe(
      style(host.querySelector("#plain")).backgroundColor,
    );
    expect(box(host.querySelector("ui-empty-content")).top).toBeGreaterThan(
      box(host.querySelector("ui-empty-description")).bottom,
    );
  });
});

describe("item parts", () => {
  test("item lays out media, content and actions in a row, with header and footer on their own lines", async () => {
    const host = await render(`
      <ui-item-group>
        <ui-item variant="outline">
          <ui-item-header>Header</ui-item-header>
          <ui-item-media variant="icon"><svg viewBox="0 0 24 24"></svg></ui-item-media>
          <ui-item-content>
            <ui-item-title>Title</ui-item-title>
            <ui-item-description>Description</ui-item-description>
          </ui-item-content>
          <ui-item-actions><button>Go</button></ui-item-actions>
          <ui-item-footer>Footer</ui-item-footer>
        </ui-item>
      </ui-item-group>
      <ui-item-media id="image" variant="image"><img src="${pixel}" alt=""></ui-item-media>`);
    const item = host.querySelector("ui-item") as Element;
    const media = item.querySelector("ui-item-media");
    const content = item.querySelector("ui-item-content");
    const actions = item.querySelector("ui-item-actions");
    expect(box(content).left).toBeGreaterThan(box(media).right);
    expect(box(actions).left).toBeGreaterThan(box(content).right - 1);
    expect(box(media).top).toBeGreaterThan(box(item.querySelector("ui-item-header")).bottom);
    expect(box(item.querySelector("ui-item-footer")).top).toBeGreaterThan(box(media).bottom);
    expect(box(media).width).toBe(32);
    expect(box(host.querySelector("#image")).width).toBe(40);
    expect(style(item.querySelector("ui-item-description")).color).not.toBe(
      style(item.querySelector("ui-item-title")).color,
    );
    expect(internalsOf.get(item)?.role).toBe("listitem");
  });
});

describe("field parts", () => {
  test("field stacks label, control and description, and a horizontal field puts content beside the control", async () => {
    const host = await render(`
      <ui-field invalid error="Required">
        <ui-label for="name">Name</ui-label>
        <input id="name">
        <ui-field-description>Your full name.</ui-field-description>
      </ui-field>
      <ui-field id="row" orientation="horizontal">
        <input type="checkbox" id="terms">
        <ui-field-content><ui-label for="terms">Accept</ui-label><ui-field-description>Terms.</ui-field-description></ui-field-content>
      </ui-field>`);
    const field = host.querySelector("ui-field") as Element;
    expect(box(field.querySelector("input")).top).toBeGreaterThan(
      box(field.querySelector("ui-label")).bottom,
    );
    expect(box(field.querySelector("ui-field-description")).top).toBeGreaterThan(
      box(field.querySelector("input")).bottom,
    );
    expect(style(field.querySelector("ui-label")).color).toBe(style(part(field, "error")).color);
    expect(part(field, "error").textContent).toBe("Required");
    const row = host.querySelector("#row") as Element;
    expect(box(row.querySelector("ui-field-content")).left).toBeGreaterThan(
      box(row.querySelector("input")).right,
    );
  });

  test("field set is named by its legend part, and field groups stack fields", async () => {
    const host = await render(`
      <ui-field-set>
        <ui-field-legend>Profile</ui-field-legend>
        <ui-field-description>Shown publicly.</ui-field-description>
        <ui-field-group><ui-field><input aria-label="A"></ui-field><ui-field><input aria-label="B"></ui-field></ui-field-group>
      </ui-field-set>
      <ui-field-legend id="label" variant="label">Small</ui-field-legend>`);
    const set = host.querySelector("ui-field-set") as Element;
    const legend = set.querySelector("ui-field-legend") as Element;
    expect(legend.slot).toBe("legend");
    expect(internalsOf.get(set)?.ariaLabelledByElements).toEqual([legend]);
    const [first, second] = [...set.querySelectorAll("ui-field")];
    expect(box(second as Element).top - box(first as Element).bottom).toBe(28);
    expect(style(host.querySelector("#label")).fontSize).toBe("14px");
  });
});

describe("input group parts", () => {
  test("addons sit before or after the input whatever their source order", async () => {
    const host = await render(`
      <form><ui-input-group name="site" value="realm.dev">
        <ui-input-group-addon align="inline-end">.com</ui-input-group-addon>
        <ui-input-group-addon>https://</ui-input-group-addon>
      </ui-input-group></form>`);
    const group = host.querySelector("ui-input-group") as Element;
    const [end, start] = [...group.querySelectorAll("ui-input-group-addon")];
    const input = part(group, "input");
    // Firefox reports fractional positions that differ in the last decimal places.
    expect(box(start as Element).right).toBeLessThanOrEqual(box(input).left + 0.01);
    expect(box(end as Element).left).toBeGreaterThanOrEqual(box(input).right - 0.01);
    expect(new FormData(host.querySelector("form") as HTMLFormElement).get("site")).toBe(
      "realm.dev",
    );
  });
});

describe("attachment, bubble and message parts", () => {
  test("attachment media and actions fill their slots", async () => {
    const host = await render(`
      <ui-attachment name="report.pdf" size="1.2 MB">
        <ui-attachment-actions><button>Remove</button></ui-attachment-actions>
        <ui-attachment-media><svg viewBox="0 0 24 24"></svg></ui-attachment-media>
      </ui-attachment>`);
    const attachment = host.querySelector("ui-attachment") as Element;
    const media = attachment.querySelector("ui-attachment-media") as Element;
    const actions = attachment.querySelector("ui-attachment-actions") as Element;
    expect(media.slot).toBe("media");
    expect(actions.slot).toBe("actions");
    expect(box(media).right).toBeLessThanOrEqual(box(part(attachment, "content")).left);
    expect(box(actions).left).toBeGreaterThanOrEqual(box(part(attachment, "content")).right);
  });

  test("bubble reactions sit under the content", async () => {
    const host = await render(
      `<ui-bubble><ui-bubble-reactions><span>+1</span></ui-bubble-reactions>Hello</ui-bubble>`,
    );
    const bubble = host.querySelector("ui-bubble") as Element;
    expect(bubble.querySelector("ui-bubble-reactions")?.slot).toBe("reactions");
    expect(box(bubble.querySelector("ui-bubble-reactions")).top).toBeGreaterThanOrEqual(
      box(part(bubble, "content")).bottom,
    );
  });

  test("message places the avatar beside the content and header and footer around it", async () => {
    const host = await render(`
      <ui-message align="end">
        <ui-message-footer>Read</ui-message-footer>
        <ui-bubble align="end">Hi</ui-bubble>
        <ui-message-avatar><ui-avatar><ui-avatar-fallback>ME</ui-avatar-fallback></ui-avatar></ui-message-avatar>
        <ui-message-header>Me</ui-message-header>
      </ui-message>`);
    const message = host.querySelector("ui-message") as Element;
    const bubble = message.querySelector("ui-bubble");
    expect(box(message.querySelector("ui-message-avatar")).left).toBeGreaterThan(box(bubble).right);
    expect(box(message.querySelector("ui-message-header")).bottom).toBeLessThanOrEqual(
      box(bubble).top,
    );
    expect(box(message.querySelector("ui-message-footer")).top).toBeGreaterThanOrEqual(
      box(bubble).bottom,
    );
  });
});

describe("avatar parts", () => {
  test("avatar image replaces the fallback once it loads, and a failed image keeps the fallback", async () => {
    const host = await render(`
      <ui-avatar id="ok"><ui-avatar-image src="${pixel}" alt="me"></ui-avatar-image><ui-avatar-fallback>AB</ui-avatar-fallback></ui-avatar>
      <ui-avatar id="bad"><ui-avatar-image src="data:image/png;base64,broken"></ui-avatar-image><ui-avatar-fallback>CD</ui-avatar-fallback></ui-avatar>
      <ui-avatar id="none"><ui-avatar-fallback>EF</ui-avatar-fallback></ui-avatar>`);
    await wait(50);
    await tick();
    const image = (id: string) =>
      part<HTMLImageElement>(host.querySelector(`${id} ui-avatar-image`), "image");
    const fallback = (id: string) =>
      part(host.querySelector(`${id} ui-avatar-fallback`), "fallback");
    expect(image("#ok").hidden).toBe(false);
    expect(image("#ok").alt).toBe("me");
    expect(fallback("#ok")).toBeNull();
    expect(image("#bad")).toBeNull();
    expect(box(fallback("#bad")).width).toBe(32);
    expect(box(fallback("#none")).width).toBe(32);
  });

  test("avatar sizes and shapes, and an avatar group overlaps its avatars with a count", async () => {
    const host = await render(`
      <ui-avatar id="sm" size="sm"></ui-avatar><ui-avatar id="lg" size="lg" shape="square"></ui-avatar>
      <ui-avatar-group>
        <ui-avatar><ui-avatar-fallback>A</ui-avatar-fallback></ui-avatar>
        <ui-avatar><ui-avatar-fallback>B</ui-avatar-fallback></ui-avatar>
        <ui-avatar-group-count>+3</ui-avatar-group-count>
      </ui-avatar-group>`);
    expect(box(host.querySelector("#sm")).width).toBe(24);
    expect(box(host.querySelector("#lg")).width).toBe(40);
    expect(style(host.querySelector("#lg")).borderTopLeftRadius).not.toBe(
      style(host.querySelector("#sm")).borderTopLeftRadius,
    );
    const group = host.querySelector("ui-avatar-group") as Element;
    const [first, second] = [...group.querySelectorAll("ui-avatar")];
    expect(box(second as Element).left).toBeLessThan(box(first as Element).right);
    expect(style(second as Element).boxShadow).not.toBe("none");
    expect(box(group.querySelector("ui-avatar-group-count")).width).toBe(32);
    expect(internalsOf.get(group)?.role).toBe("group");
  });
});

describe("attribute-driven sizes and variants", () => {
  test("badge shapes, skeleton sizes and spinner colours come from attributes", async () => {
    const host = await render(`
      <ui-badge id="pill" shape="pill">New</ui-badge><ui-badge id="round" shape="round">8</ui-badge>
      <ui-skeleton width="12" height="4"></ui-skeleton><ui-skeleton id="circle" width="12" height="12" shape="circle"></ui-skeleton>
      <ui-spinner variant="primary"></ui-spinner><ui-spinner id="muted" variant="muted"></ui-spinner><ui-spinner id="danger" variant="destructive"></ui-spinner>`);
    expect(style(host.querySelector("#pill")).borderTopLeftRadius).not.toBe(
      style(host.querySelector("ui-badge:not([shape])") ?? document.createElement("ui-badge"))
        .borderTopLeftRadius,
    );
    const round = box(host.querySelector("#round"));
    expect(round.height).toBe(20);
    expect(round.width).toBe(20);
    const skeleton = box(host.querySelector("ui-skeleton"));
    expect([skeleton.width, skeleton.height]).toEqual([48, 16]);
    expect(style(host.querySelector("#circle")).borderTopLeftRadius).not.toBe("0px");
    const colors = [...host.querySelectorAll("ui-spinner")].map((el) => style(el).color);
    expect(new Set(colors).size).toBe(3);
  });

  test("scroll area, resizable, message scroller and carousel take width and height in spacing units", async () => {
    const host = await render(`
      <ui-scroll-area width="48" height="20" variant="outline"><div style="height: 400px">tall</div></ui-scroll-area>
      <ui-resizable height="25" variant="outline"><ui-resizable-panel>A</ui-resizable-panel></ui-resizable>
      <ui-message-scroller height="15"><p>1</p></ui-message-scroller>`);
    const area = host.querySelector("ui-scroll-area") as Element;
    expect([box(area).width, box(area).height]).toEqual([192, 80]);
    expect(style(area).borderTopStyle).toBe("solid");
    const resizable = host.querySelector("ui-resizable") as Element;
    expect(box(resizable).height).toBe(100);
    expect(style(resizable).borderTopStyle).toBe("solid");
    expect(box(host.querySelector("ui-message-scroller")).height).toBe(60);
  });

  test("table, chart, code block and progress fill the width of their container", async () => {
    const host = await render(`
      <div style="display: flex; width: 500px">
        <ui-table></ui-table>
      </div>
      <div style="display: flex; width: 500px"><ui-chart></ui-chart></div>
      <div style="display: flex; width: 500px"><ui-code-block><pre>x</pre></ui-code-block></div>
      <div style="display: flex; width: 500px"><ui-progress value="10"></ui-progress></div>`);
    for (const name of ["ui-table", "ui-chart", "ui-code-block", "ui-progress"])
      expect(box(host.querySelector(name)).width).toBe(500);
    expect(style(host.querySelector("pre")).marginTop).toBe("0px");
  });
});

describe("carousel parts", () => {
  const carousel = async (orientation = "horizontal") => {
    const host = await render(`
      <div style="width: 300px">
        <ui-carousel orientation="${orientation}" height="50">
          <ui-carousel-content>
            <ui-carousel-item><div style="border: 4px solid; padding: 8px">1</div></ui-carousel-item>
            <ui-carousel-item>2</ui-carousel-item>
            <ui-carousel-item>3</ui-carousel-item>
          </ui-carousel-content>
          <ui-carousel-previous></ui-carousel-previous>
          <ui-carousel-next></ui-carousel-next>
        </ui-carousel>
      </div>`);
    const root = host.querySelector("ui-carousel") as HTMLElement;
    return {
      root,
      track: part(root.querySelector("ui-carousel-content"), "track"),
      items: [...root.querySelectorAll("ui-carousel-item")],
      previous: shadow(root.querySelector("ui-carousel-previous")).querySelector(
        "ui-button",
      ) as HTMLElement & { disabled: boolean },
      next: shadow(root.querySelector("ui-carousel-next")).querySelector(
        "ui-button",
      ) as HTMLElement & { disabled: boolean },
    };
  };

  test("carousel items fill the track between the previous and next buttons", async () => {
    const { root, track, items, previous, next } = await carousel();
    expect(box(previous).right).toBeLessThanOrEqual(box(track).left);
    expect(box(next).left).toBeGreaterThanOrEqual(box(track).right);
    expect(box(items[0] as Element).width).toBe(track.clientWidth);
    expect(internalsOf.get(items[0] as Element)?.ariaRoleDescription).toBe("slide");
    expect(internalsOf.get(root)?.ariaRoleDescription).toBe("carousel");
    expect(previous.disabled).toBe(true);
    expect(next.disabled).toBe(false);
  });

  test("carousel previous and next buttons and arrow keys move between items", async () => {
    const { root, track, previous, next } = await carousel();
    const changes: number[] = [];
    root.addEventListener("change", (event) => changes.push((event as CustomEvent).detail.index));
    part(next, "button").click();
    await wait(600);
    track.dispatchEvent(new Event("scrollend"));
    await tick();
    expect(track.scrollLeft).toBeGreaterThan(0);
    expect(changes.at(-1)).toBe(1);
    expect(previous.disabled).toBe(false);
    track.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }),
    );
    await wait(600);
    track.dispatchEvent(new Event("scrollend"));
    await tick();
    expect(changes.at(-1)).toBe(2);
    expect(next.disabled).toBe(true);
    part(previous, "button").click();
    track.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await wait(600);
    track.dispatchEvent(new Event("scrollend"));
    await tick();
    expect(changes.at(-1)).toBe(1);
  });

  test("a vertical carousel stacks items in the height it is given", async () => {
    const { root, track, items, previous, next } = await carousel("vertical");
    expect(box(root).height).toBe(200);
    expect(box(items[0] as Element).height).toBe(track.clientHeight);
    expect(box(previous).bottom).toBeLessThanOrEqual(box(track).top);
    expect(box(next).top).toBeGreaterThanOrEqual(box(track).bottom);
    track.scrollTop = track.clientHeight;
    track.dispatchEvent(new Event("scrollend"));
    await tick();
    expect(previous.disabled).toBe(false);
  });
});

test("empty title is a heading whose level can be set", async () => {
  const host = await render(
    `<ui-empty><ui-empty-header><ui-empty-title>None</ui-empty-title></ui-empty-header></ui-empty><ui-empty><ui-empty-title level="2">Two</ui-empty-title></ui-empty>`,
  );
  const [first, second] = [...host.querySelectorAll("ui-empty-title")].map((el) =>
    part(el, "title"),
  );
  expect(first?.getAttribute("role")).toBe("heading");
  expect(first?.getAttribute("aria-level")).toBe("3");
  expect(second?.getAttribute("aria-level")).toBe("2");
});
