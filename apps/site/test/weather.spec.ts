import AxeBuilder from "@axe-core/playwright";
import type { Page, Route } from "@playwright/test";
import { expect, ready, test } from "./fixtures";

const PLACES = {
  results: [
    {
      id: 2950159,
      name: "Berlin",
      latitude: 52.52437,
      longitude: 13.41053,
      country: "Germany",
      admin1: "Land Berlin",
    },
    {
      id: 5083330,
      name: "Berlin",
      latitude: 44.46867,
      longitude: -71.18508,
      country: "United States",
      admin1: "New Hampshire",
    },
  ],
};

const DAYS = [
  "2026-10-19",
  "2026-10-20",
  "2026-10-21",
  "2026-10-22",
  "2026-10-23",
  "2026-10-24",
  "2026-10-25",
];

const forecast = (fahrenheit: boolean) => {
  const unit = fahrenheit ? "°F" : "°C";
  const temperature = (celsius: number) => (fahrenheit ? (celsius * 9) / 5 + 32 : celsius);
  return {
    current_units: {
      temperature_2m: unit,
      apparent_temperature: unit,
      relative_humidity_2m: "%",
      wind_speed_10m: "km/h",
    },
    current: {
      temperature_2m: temperature(12.3),
      apparent_temperature: temperature(10.1),
      relative_humidity_2m: 71,
      weather_code: 3,
      wind_speed_10m: 14.2,
    },
    daily_units: { temperature_2m_max: unit, temperature_2m_min: unit },
    daily: {
      time: DAYS,
      weather_code: [3, 61, 0, 2, 95, 71, 45],
      temperature_2m_max: [14, 11, 16, 15, 13, 3, 9].map(temperature),
      temperature_2m_min: [7, 6, 5, 8, 6, -2, 4].map(temperature),
      precipitation_probability_max: [10, 80, 0, 5, 60, 40, 20],
    },
  };
};

const json = (route: Route, body: unknown, status = 200) =>
  route.fulfill({
    status,
    contentType: "application/json",
    headers: { "access-control-allow-origin": "*" },
    body: JSON.stringify(body),
  });

const mock = async (page: Page, { failForecast = false } = {}) => {
  const searches: string[] = [];
  const forecasts: URL[] = [];
  await page.route("https://geocoding-api.open-meteo.com/**", (route) => {
    const url = new URL(route.request().url());
    const name = url.searchParams.get("name") ?? "";
    searches.push(name);
    return json(route, name.startsWith("Ber") ? PLACES : {});
  });
  await page.route("https://api.open-meteo.com/**", (route) => {
    const url = new URL(route.request().url());
    forecasts.push(url);
    if (failForecast)
      return json(route, { error: true, reason: "Latitude must be in range of -90 to 90°." }, 400);
    return json(route, forecast(url.searchParams.get("temperature_unit") === "fahrenheit"));
  });
  return { searches, forecasts };
};

test("weather: debounced city search, forecast for the chosen place and unit toggle", async ({
  page,
  errors,
}) => {
  const { searches, forecasts } = await mock(page);
  await page.goto("examples/weather/");
  await ready(page, "weather-app");

  await expect(page.getByRole("heading", { name: "Pick a place" })).toBeVisible();
  const city = page.getByRole("searchbox", { name: "City" });
  await city.pressSequentially("Berlin", { delay: 20 });
  const results = page.getByRole("list", { name: "Matching places" });
  await expect(results.getByRole("button")).toHaveCount(2);
  expect(searches).toEqual(["Berlin"]);

  await results.getByRole("button", { name: "Berlin, Land Berlin, Germany" }).click();
  await expect(results).toBeHidden();
  await expect(page.getByRole("heading", { name: "Berlin, Land Berlin, Germany" })).toBeVisible();
  await expect(page.locator("weather-app .temperature")).toHaveText("12°C");
  await expect(page.getByText("Overcast").first()).toBeVisible();
  const days = page.getByRole("list", { name: "Daily forecast" }).getByRole("listitem");
  await expect(days).toHaveCount(7);
  await expect(days.first()).toContainText("Today");
  await expect(days.nth(5)).toContainText("3°C / -2°C");
  await expect(page.getByRole("img", { name: /Daily high and low/ })).toBeVisible();

  const first = forecasts[0] as URL;
  expect(first.searchParams.get("latitude")).toBe("52.52437");
  expect(first.searchParams.get("longitude")).toBe("13.41053");
  expect(first.searchParams.get("temperature_unit")).toBe("celsius");
  expect(first.searchParams.get("daily")).toContain("temperature_2m_max");

  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.map(({ id }) => id)).toEqual([]);

  await page.getByRole("radio", { name: "°F" }).check();
  await expect(page.locator("weather-app .temperature")).toHaveText("54°F");
  expect(forecasts.at(-1)?.searchParams.get("temperature_unit")).toBe("fahrenheit");
  expect(forecasts.at(-1)?.searchParams.get("latitude")).toBe("52.52437");
  void errors;
});

test("weather: unknown places say so and Enter does not leave the page", async ({
  page,
  errors,
}) => {
  const { searches } = await mock(page);
  await page.goto("examples/weather/");
  await ready(page, "weather-app");

  const city = page.getByRole("searchbox", { name: "City" });
  await city.fill("Nowhere");
  await expect(page.getByText("No places match that name.")).toBeVisible();
  await city.press("Enter");
  await page.waitForTimeout(400);
  expect(page.url()).toMatch(/examples\/weather\/$/);
  expect(searches).toEqual(["Nowhere"]);

  await city.fill("");
  await expect(page.getByText("No places match that name.")).toBeHidden();
  void errors;
});

test("weather: a failed forecast shows an error and can be retried", async ({ page, errors }) => {
  await mock(page, { failForecast: true });
  await page.goto("examples/weather/");
  await ready(page, "weather-app");

  await page.getByRole("searchbox", { name: "City" }).fill("Berlin");
  await page.getByRole("button", { name: "Berlin, New Hampshire, United States" }).click();
  await expect(page.getByText("Latitude must be in range of -90 to 90°.")).toBeVisible();
  await page.unrouteAll();
  await mock(page);
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByText("Couldn't load the forecast")).toBeHidden();
  await expect(page.locator("weather-app .temperature")).toHaveText("12°C");
  const logged = errors.splice(0);
  expect(logged.every((message) => message.includes("400"))).toBe(true);
});

test("weather: an unreachable service is reported for search and forecast", async ({
  page,
  errors,
}) => {
  await page.route("https://geocoding-api.open-meteo.com/**", (route) => route.abort("failed"));
  await page.goto("examples/weather/");
  await ready(page, "weather-app");

  const city = page.getByRole("searchbox", { name: "City" });
  await city.fill("Berlin");
  const searchAlert = page.getByText("Place search is unavailable. Try again in a moment.");
  await expect(searchAlert).toBeVisible();
  await city.fill("Berli");
  await expect(searchAlert).toBeHidden();

  await page.unrouteAll();
  await mock(page);
  await page.route("https://api.open-meteo.com/**", (route) => route.abort("failed"));
  await city.fill("Berlin");
  await page.getByRole("button", { name: "Berlin, Land Berlin, Germany" }).click();
  await expect(page.getByText("Couldn't load the forecast")).toBeVisible();
  await expect(page.getByText("The weather service is unavailable right now.")).toBeVisible();
  const logged = errors.splice(0);
  expect(logged.every((message) => /ERR_FAILED|open-meteo\.com/.test(message))).toBe(true);
});
