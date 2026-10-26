import { defineStore } from "https://realm.js.org/dist/realm.js";

const API = "https://api.github.com";
const PER_PAGE = 10;

const count = new Intl.NumberFormat("en", { notation: "compact" });
const date = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const time = new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" });

const plural = (value, word, words = `${word}s`) =>
  `${count.format(value)} ${value === 1 ? word : words}`;

export const SORTS = [
  { id: "updated", label: "Recently updated" },
  { id: "created", label: "Newest" },
  { id: "full_name", label: "Name" },
];

const initialLogin = () => new URLSearchParams(location.search).get("user")?.trim() ?? "";

const host = (url) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

export const github = defineStore("example-github", {
  headers: { Accept: "application/vnd.github+json" },
  perPage: PER_PAGE,
  query: "",
  results: null,
  searching: false,
  searchError: "",
  login: initialLogin(),
  user: null,
  userBusy: false,
  userError: "",
  repos: [],
  reposBusy: false,
  reposError: "",
  sort: "updated",
  page: 1,
  remaining: null,
  attempt: 0,
  get userUrl() {
    return `${API}/users/${encodeURIComponent(this.login)}`;
  },
  get reposUrl() {
    return `${this.userUrl}/repos`;
  },
  get userRequest() {
    return [this.login, this.attempt];
  },
  get reposRequest() {
    return [this.sort, this.page, this.attempt];
  },
  get users() {
    return (this.results?.items ?? []).map((item) => ({
      ...item,
      initials: item.login.slice(0, 2).toUpperCase(),
      current: item.login.toLowerCase() === this.login.toLowerCase(),
    }));
  },
  get searchSummary() {
    if (!this.results) return "";
    return this.results.total_count
      ? `${plural(this.results.total_count, "user")} found`
      : "No users match that search.";
  },
  get loadingProfile() {
    return this.userBusy && this.user?.login?.toLowerCase() !== this.login.toLowerCase();
  },
  get profile() {
    const user = this.user;
    if (!user || this.loadingProfile || this.userError) return null;
    return {
      login: user.login,
      name: user.name || user.login,
      avatar: user.avatar_url,
      initials: user.login.slice(0, 2).toUpperCase(),
      url: user.html_url,
      bio: user.bio ?? "",
      company: user.company ?? "",
      location: user.location ?? "",
      blog: user.blog
        ? {
            href: /^https?:/.test(user.blog) ? user.blog : `https://${user.blog}`,
            label: host(user.blog),
          }
        : null,
      followers: plural(user.followers, "follower"),
      following: `${count.format(user.following)} following`,
      repos: plural(user.public_repos, "public repository", "public repositories"),
      joined: `Joined ${date.format(new Date(user.created_at))}`,
    };
  },
  get pages() {
    return Math.max(1, Math.ceil((this.user?.public_repos ?? 0) / PER_PAGE));
  },
  get paged() {
    return this.pages > 1;
  },
  get rows() {
    return this.repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      url: repo.html_url,
      description: repo.description ?? "",
      language: repo.language ?? "",
      stars: plural(repo.stargazers_count, "star"),
      forks: plural(repo.forks_count, "fork"),
      updated: `Updated ${date.format(new Date(repo.updated_at))}`,
      fork: repo.fork,
    }));
  },
  get noRepos() {
    return Boolean(this.profile) && !this.reposBusy && !this.reposError && this.repos.length === 0;
  },
  get rate() {
    return this.remaining === null
      ? ""
      : `${plural(this.remaining.left, "request")} left until ${this.remaining.reset}`;
  },
});

export const selectUser = (login) => {
  github.page = 1;
  github.userError = "";
  github.reposError = "";
  github.login = login;
  history.replaceState(null, "", `?user=${encodeURIComponent(login)}`);
};

export const retry = () => {
  github.userError = "";
  github.reposError = "";
  github.attempt++;
};

export const noteRate = (headers) => {
  const left = headers?.get("x-ratelimit-remaining");
  if (left === null || left === undefined) return;
  const reset = new Date(Number(headers.get("x-ratelimit-reset")) * 1000);
  github.remaining = { left: Number(left), reset: time.format(reset) };
};

const FAILURES = {
  0: () => "GitHub could not be reached. Check your connection and try again.",
  403: (detail) => detail.data?.message ?? "GitHub refused the request.",
  404: (_, subject) => `There is no GitHub user called “${subject}”.`,
  422: (detail) => detail.data?.message ?? "GitHub could not run that search.",
};

// GitHub answers 403 or 429 with x-ratelimit-remaining: 0 when the anonymous limit is used up.
export const describeFailure = (event, subject) => {
  if (event.type === "timeout") return "GitHub took too long to answer. Try again in a moment.";
  const { detail } = event;
  noteRate(detail.headers);
  if (detail.headers?.get("x-ratelimit-remaining") === "0")
    return `You have used GitHub's limit of requests without signing in. It resets at ${github.remaining.reset}.`;
  const failure =
    FAILURES[detail.status] ?? (() => `GitHub answered with an error (${detail.status}).`);
  return failure(detail, subject);
};
