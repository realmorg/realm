import { describe, expect, test } from "vitest";
import theme from "../theme.css?raw";

const tokensOf = (selector: string): Record<string, string> => {
  const start = theme.indexOf(`${selector} {`);
  const block = theme.slice(start, theme.indexOf("}", start));
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value?.trim()]),
  );
};

const light = tokensOf(":root");
const dark = { ...light, ...tokensOf(':root[data-theme="dark"]') };
const systemDark = { ...light, ...tokensOf(':root:not([data-theme="light"])') };

const canvas = document.createElement("canvas");
canvas.width = canvas.height = 1;
const context = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

// The browser converts and gamut-maps the oklch() values, so the ratio matches what is painted.
const luminance = (...colours: (string | undefined)[]) => {
  context.clearRect(0, 0, 1, 1);
  for (const colour of colours) {
    context.fillStyle = colour ?? "transparent";
    context.fillRect(0, 0, 1, 1);
  }
  const [red = 0, green = 0, blue = 0] = [...context.getImageData(0, 0, 1, 1).data].map(
    (channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    },
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const contrast = (tokens: Record<string, string>, foreground: string, background: string) => {
  const back = luminance(tokens[background]);
  const front = luminance(tokens[background], tokens[foreground]);
  return (Math.max(front, back) + 0.05) / (Math.min(front, back) + 0.05);
};

const TEXT: [string, string][] = [
  ["foreground", "background"],
  ["card-foreground", "card"],
  ["popover-foreground", "popover"],
  ["primary-foreground", "primary"],
  ["primary", "background"],
  ["primary", "card"],
  ["secondary-foreground", "secondary"],
  ["muted-foreground", "background"],
  ["muted-foreground", "card"],
  ["muted-foreground", "muted"],
  ["accent-foreground", "accent"],
  ["destructive", "background"],
  ["destructive", "card"],
  ["destructive-foreground", "destructive"],
  ["sidebar-foreground", "sidebar"],
  ["sidebar-foreground", "sidebar-accent"],
  ["sidebar-primary-foreground", "sidebar-primary"],
  ["sidebar-primary", "sidebar"],
];

const INTERFACE: [string, string][] = [
  ["input", "background"],
  ["input", "card"],
  ["input", "muted"],
  ["ring", "background"],
  ["ring", "card"],
  ["sidebar-ring", "sidebar"],
  ...["1", "2", "3", "4", "5"].flatMap((series): [string, string][] => [
    [`chart-${series}`, "background"],
    [`chart-${series}`, "card"],
  ]),
];

const failures = (tokens: Record<string, string>, pairs: [string, string][], minimum: number) =>
  pairs
    .map(([foreground, background]) => ({
      pair: `${foreground} on ${background}`,
      ratio: Number(contrast(tokens, foreground, background).toFixed(2)),
    }))
    .filter(({ ratio }) => ratio < minimum);

describe("theme contrast", () => {
  test("the system dark theme uses the same tokens as data-theme dark", () => {
    expect(systemDark).toEqual(dark);
  });

  for (const [scheme, tokens] of [
    ["light", light],
    ["dark", dark],
  ] as const) {
    test(`${scheme} text tokens reach 4.5:1 on their surfaces`, () => {
      expect(failures(tokens, TEXT, 4.5)).toEqual([]);
    });

    test(`${scheme} input borders, focus rings and chart colours reach 3:1`, () => {
      expect(failures(tokens, INTERFACE, 3)).toEqual([]);
    });
  }

  test("the focus ring is drawn in the ring colour at full strength", () => {
    expect(light["focus-ring"]).toBe("0 0 0 2px var(--ring)");
  });
});
