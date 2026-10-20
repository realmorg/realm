// Behaviour follows the Open UI / WHATWG focusgroup proposal: a behaviour token plus inline, block and wrap.
import { expect, test } from "vitest";
import { define, render, root, tag } from "./helpers";

const press = (target: Element, key: string) =>
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, composed: true, cancelable: true }),
  );

test("focusgroup moves focus with arrow keys, Home and End, across slotted items", async () => {
  const name = tag("group");
  await define(`<custom-element name="${name}">
    <div id="h" focusgroup="toolbar inline wrap"><button>a</button><button disabled>x</button><span tabindex="0" disabled>d</span><span><button>b</button></span><button>c</button></div>
    <div id="v" focusgroup="menu block"><slot></slot></div>
    <div id="both" focusgroup="listbox"><button>1</button><button>2</button></div>
    <div id="rtl" dir="rtl" focusgroup="tablist inline"><button>r1</button><button>r2</button></div>
  </custom-element>`);
  const el = render(
    `<${name}><a href="#one">one</a><a href="#two">two</a><span tabindex="-2">skip</span></${name}>`,
  ).querySelector(name) as Element;
  const shadow = root(el);
  const h = [...(shadow.getElementById("h") as Element).querySelectorAll("button")];
  h[0]?.focus();
  press(h[0] as Element, "ArrowRight");
  expect(shadow.activeElement).toBe(h[2]);
  press(h[2] as Element, "End");
  expect(shadow.activeElement).toBe(h[3]);
  press(h[3] as Element, "ArrowRight");
  expect(shadow.activeElement).toBe(h[0]);
  press(h[0] as Element, "ArrowDown");
  expect(shadow.activeElement).toBe(h[0]);
  press(h[0] as Element, "ArrowLeft");
  expect(shadow.activeElement).toBe(h[3]);
  press(h[3] as Element, "Home");
  expect(shadow.activeElement).toBe(h[0]);
  const [one, two] = [...el.querySelectorAll("a")];
  one?.focus();
  press(one as Element, "ArrowDown");
  expect(document.activeElement).toBe(two);
  press(two as Element, "ArrowDown");
  expect(document.activeElement).toBe(two);
  press(two as Element, "ArrowUp");
  expect(document.activeElement).toBe(one);
  press(one as Element, "ArrowUp");
  expect(document.activeElement).toBe(one);
  const both = [...(shadow.getElementById("both") as Element).querySelectorAll("button")];
  both[0]?.focus();
  press(both[0] as Element, "ArrowDown");
  expect(shadow.activeElement).toBe(both[1]);
  press(both[1] as Element, "ArrowLeft");
  expect(shadow.activeElement).toBe(both[0]);
  press(both[0] as Element, "Enter");
  press(shadow.getElementById("both") as Element, "ArrowDown");
  expect(shadow.activeElement).toBe(both[0]);
  const rtl = [...(shadow.getElementById("rtl") as Element).querySelectorAll("button")];
  rtl[0]?.focus();
  press(rtl[0] as Element, "ArrowLeft");
  expect(shadow.activeElement).toBe(rtl[1]);
  const v = shadow.getElementById("v") as Element;
  v.removeAttribute("focusgroup");
  one?.focus();
  press(one as Element, "ArrowRight");
  expect(document.activeElement).toBe(two);
});

test("custom elements that delegate focus are focusgroup items", async () => {
  const button = tag("delegating");
  const bar = tag("bar");
  await define(`
    <custom-element name="${button}" delegates-focus><button>inner</button></custom-element>
    <custom-element name="${bar}"><div focusgroup="toolbar inline"><slot></slot></div></custom-element>`);
  const host = render(`<${bar}><${button}></${button}><${button}></${button}></${bar}>`);
  const [first, second] = [...host.querySelectorAll(button)];
  (first as HTMLElement).focus();
  press(root(first as Element).querySelector("button") as Element, "ArrowRight");
  expect(document.activeElement).toBe(second);
});

test("focusgroup reaches into shadow roots and skips items that are not rendered", async () => {
  const link = tag("link");
  const menu = tag("menu");
  const bar = tag("bar");
  await define(`
    <custom-element name="${link}"><a href="#x"><slot></slot></a></custom-element>
    <custom-element name="${menu}"><button>menu</button><div hidden><slot></slot></div></custom-element>
    <custom-element name="${bar}"><nav focusgroup="menubar inline"><slot></slot></nav></custom-element>`);
  const host = render(
    `<${bar}><${link}>one</${link}><${menu}><button id="closed">inside closed menu</button></${menu}><${link}>two</${link}></${bar}>`,
  );
  const [one, two] = [...host.querySelectorAll(link)].map(
    (el) => root(el).querySelector("a") as HTMLAnchorElement,
  );
  const menuButton = root(host.querySelector(menu) as Element).querySelector(
    "button",
  ) as HTMLElement;
  one?.focus();
  press(one as Element, "ArrowRight");
  expect(root(host.querySelector(menu) as Element).activeElement).toBe(menuButton);
  press(menuButton, "ArrowRight");
  expect(root(host.querySelectorAll(link)[1] as Element).activeElement).toBe(two);
});
