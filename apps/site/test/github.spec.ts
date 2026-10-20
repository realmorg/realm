import AxeBuilder from "@axe-core/playwright";
import type { Page, Route } from "@playwright/test";
import { expect, ready, test } from "./fixtures";

const AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Crect width='8' height='8' fill='%23888'/%3E%3C/svg%3E";
const RESET = Math.floor(Date.UTC(2026, 9, 20, 15, 30) / 1000);

const USERS: Record<string, object> = {
  octocat: {
    login: "octocat",
    name: "The Octocat",
    avatar_url: AVATAR,
    html_url: "https://github.com/octocat",
    bio: "GitHub's mascot.",
    company: "@github",
    location: "San Francisco",
    blog: "github.blog",
    followers: 1,
    following: 9,
    public_repos: 23,
    created_at: "2011-01-25T18:44:36Z",
  },
  quiet: {
    login: "quiet",
    name: null,
    avatar_url: AVATAR,
    html_url: "https://github.com/quiet",
    bio: null,
    company: null,
    location: null,
    blog: "",
    followers: 2400,
    following: 0,
    public_repos: 0,
    created_at: "2020-05-01T00:00:00Z",
  },
};

const repo = (name: string, index: number) => ({
  id: index,
  name,
  html_url: `https://github.com/octocat/${name}`,
  description: index === 1 ? null : `Repository ${name}`,
  language: index === 1 ? null : "JavaScript",
  stargazers_count: index * 10,
  forks_count: 1,
  updated_at: "2026-10-01T10:00:00Z",
  fork: index === 2,
});

interface Options {
  delay?: number;
  status?: Record<string, number>;
}

const json = (route: Route, body: unknown, status = 200, remaining = "59") =>
  route.fulfill({
    status,
    contentType: "application/json",
    headers: {
      "access-control-allow-origin": "*",
      "access-control-expose-headers": "x-ratelimit-remaining, x-ratelimit-reset",
      "x-ratelimit-remaining": remaining,
      "x-ratelimit-reset": String(RESET),
    },
    body: JSON.stringify(body),
  });

const mock = async (page: Page, { delay = 0 }: Options = {}) => {
  const requests: URL[] = [];
  const accepts: string[] = [];
  await page.route("https://api.github.com/**", async (route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    accepts.push((await route.request().allHeaders()).accept ?? "");
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    const search = url.pathname === "/search/users";
    if (search) {
      const q = url.searchParams.get("q") ?? "";
      const items = q.startsWith("oct")
        ? [
            { id: 1, login: "octocat", avatar_url: AVATAR },
            { id: 2, login: "octo-org", avatar_url: AVATAR },
          ]
        : [];
      return json(route, { total_count: items.length, items });
    }
    const [, , login, part] = url.pathname.split("/");
    const user = USERS[login as string];
    if (!user) return json(route, { message: "Not Found" }, 404);
    if (!part) return json(route, user);
    if (login === "quiet") return json(route, []);
    const pageNumber = Number(url.searchParams.get("page"));
    const sort = url.searchParams.get("sort");
    const size = pageNumber === 3 ? 3 : 10;
    return json(
      route,
      Array.from({ length: size }, (_, i) => repo(`${sort}-p${pageNumber}-r${i + 1}`, i + 1)),
    );
  });
  return { requests, accepts };
};

const open = async (page: Page, query = "") => {
  await page.goto(`examples/github/${query}`);
  await ready(page, "github-explorer");
};

const search = (page: Page) => page.getByRole("searchbox", { name: "Search GitHub users" });
const users = (page: Page) => page.getByRole("list", { name: "Users" }).getByRole("button");
const repos = (page: Page) =>
  page.getByRole("list", { name: "Repositories" }).getByRole("listitem");

test("github: debounced search, then a profile and its repositories", async ({ page, errors }) => {
  const { requests, accepts } = await mock(page);
  await open(page);
  await expect(page.getByRole("heading", { name: "Find someone on GitHub" })).toBeVisible();

  await search(page).pressSequentially("oct");
  await expect(users(page)).toHaveCount(2);
  await expect(users(page).first()).toHaveAccessibleName("octocat");
  await expect(users(page).last()).toHaveAccessibleName("octo-org");
  await expect(page.getByText("2 users found")).toBeVisible();
  expect(requests.map((url) => url.search)).toEqual(["?q=oct&per_page=10"]);
  expect(accepts[0]).toBe("application/vnd.github+json");

  await users(page).first().click();
  await expect(users(page).first()).toHaveAttribute("aria-current", "true");
  await expect(page).toHaveURL(/\?user=octocat$/);
  const profile = page.getByRole("region", { name: "Profile" });
  await expect(profile.getByRole("heading", { name: "The Octocat" })).toBeVisible();
  await expect(profile.getByRole("link", { name: "octocat on GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/octocat",
  );
  const details = profile.getByRole("list", { name: "Details" });
  await expect(details).toContainText("1 follower · 9 following");
  await expect(details).toContainText("23 public repositories");
  await expect(details.getByRole("link", { name: "github.blog" })).toHaveAttribute(
    "href",
    "https://github.blog",
  );
  await expect(details).toContainText("Joined Jan 25, 2011");

  await expect(repos(page)).toHaveCount(10);
  await expect(repos(page).first().getByRole("heading")).toHaveText("updated-p1-r1");
  await expect(repos(page).nth(1)).toContainText("Fork");
  await expect(repos(page).nth(1)).toContainText("20 stars");
  const reposRequest = requests.find((url) => url.pathname.endsWith("/repos")) as URL;
  expect(Object.fromEntries(reposRequest.searchParams)).toEqual({
    sort: "updated",
    page: "1",
    per_page: "10",
  });
  await expect(page.getByText(/^59 requests left until /)).toBeVisible();
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(
    violations.map(
      ({ id, nodes }) => `${id}: ${nodes.map((node) => node.target.join(" > ")).join(", ")}`,
    ),
  ).toEqual([]);
  void errors;
});

test("github: sort and paginate repositories through state triggers", async ({ page, errors }) => {
  const { requests } = await mock(page);
  await open(page, "?user=octocat");
  await expect(repos(page)).toHaveCount(10);
  const pagination = page.getByRole("navigation", { name: "Repository pages" });
  await expect(pagination).toBeVisible();

  await page.getByRole("combobox", { name: "Sort repositories" }).selectOption("full_name");
  await expect(repos(page).first().getByRole("heading")).toHaveText("full_name-p1-r1");
  await pagination.getByRole("button", { name: "3" }).click();
  await expect(repos(page)).toHaveCount(3);
  await expect(repos(page).first().getByRole("heading")).toHaveText("full_name-p3-r1");
  await pagination.getByRole("button", { name: /previous/i }).click();
  await expect(repos(page).first().getByRole("heading")).toHaveText("full_name-p2-r1");

  await page.getByRole("combobox", { name: "Sort repositories" }).selectOption("created");
  await expect(repos(page).first().getByRole("heading")).toHaveText("created-p1-r1");
  const last = requests.filter((url) => url.pathname.endsWith("/repos")).at(-1) as URL;
  expect(last.searchParams.get("page")).toBe("1");
  void errors;
});

test("github: skeletons show while the profile and repositories load", async ({ page, errors }) => {
  await mock(page, { delay: 1500 });
  await open(page, "?user=octocat");
  await expect(page.getByRole("region", { name: "Profile" })).toHaveAttribute("aria-busy", "true");
  await expect(page.getByRole("status", { name: "Loading profile" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The Octocat" })).toBeVisible();
  await expect(page.getByRole("status", { name: "Loading repositories" })).toBeVisible();
  await expect(repos(page)).toHaveCount(10);
  await expect(page.getByRole("status", { name: "Loading repositories" })).toHaveCount(0);
  void errors;
});

test("github: empty searches send nothing and unmatched searches say so", async ({
  page,
  errors,
}) => {
  const { requests } = await mock(page);
  await open(page);
  await search(page).fill("zz");
  await expect(page.getByText("No users match that search.")).toBeVisible();
  await search(page).fill("oct");
  await expect(users(page)).toHaveCount(2);
  await search(page).fill("   ");
  await expect(users(page)).toHaveCount(0);
  await page.waitForTimeout(600);
  expect(requests.map((url) => url.searchParams.get("q"))).toEqual(["zz", "oct"]);

  await page.goto("examples/github/?user=quiet");
  await ready(page, "github-explorer");
  await expect(page.getByRole("heading", { name: "quiet" })).toBeVisible();
  await expect(page.getByText("2.4K followers · 0 following")).toBeVisible();
  await expect(page.getByText("No public repositories yet.")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Repository pages" })).toHaveCount(0);
  void errors;
});

test("github: unknown users, rate limits, server errors and lost connections", async ({
  page,
  errors,
}) => {
  await mock(page);
  await open(page, "?user=ghost");
  await expect(page.getByText("There is no GitHub user called “ghost”.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Repositories" })).toHaveCount(0);

  await page.route("https://api.github.com/search/users**", (route) =>
    json(route, { message: "API rate limit exceeded" }, 403, "0"),
  );
  await search(page).fill("oct");
  await expect(
    page.getByText(/You have used GitHub's limit of requests without signing in\. It resets at /),
  ).toBeVisible();
  await expect(page.getByText(/^0 requests left until /)).toBeVisible();

  await page.route("https://api.github.com/search/users**", (route) =>
    json(route, { message: "Validation Failed" }, 422),
  );
  await search(page).fill("octo");
  await expect(page.getByText("Validation Failed")).toBeVisible();

  await page.route("https://api.github.com/search/users**", (route) => json(route, {}, 500));
  await search(page).fill("octoc");
  await expect(page.getByText("GitHub answered with an error (500).")).toBeVisible();

  await page.route("https://api.github.com/search/users**", (route) => route.abort("failed"));
  await search(page).fill("octoca");
  await expect(
    page.getByText("GitHub could not be reached. Check your connection and try again."),
  ).toBeVisible();

  await page.unrouteAll();
  await mock(page);
  await search(page).fill("octocat");
  await expect(users(page)).toHaveCount(2);
  await expect(page.getByRole("heading", { name: "Search failed" })).toHaveCount(0);
  await users(page).first().click();
  await expect(page.getByRole("heading", { name: "The Octocat" })).toBeVisible();

  await page.route("https://api.github.com/users/octocat", (route) =>
    json(route, { message: "Forbidden" }, 403),
  );
  await page.route("https://api.github.com/users/octocat/repos**", (route) =>
    json(route, { message: "Server Error" }, 503),
  );
  await page.getByRole("combobox", { name: "Sort repositories" }).selectOption("created");
  await expect(page.getByText("GitHub answered with an error (503).")).toBeVisible();
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByText("Couldn't load this profile")).toBeVisible();
  await expect(page.getByText("Forbidden")).toBeVisible();

  await page.unrouteAll();
  await mock(page);
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("heading", { name: "The Octocat" })).toBeVisible();
  await expect(repos(page)).toHaveCount(10);

  const logged = errors.splice(0);
  expect(
    logged.every((message) => /40[34]|422|50[03]|ERR_FAILED|api\.github\.com/.test(message)),
  ).toBe(true);
});
