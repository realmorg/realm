const DATABASE = "realm-example-contacts";
const STORE = "contacts";
const LATENCY = 150;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROUTE = /\/api\/contacts(?:\/([^/]+))?$/;

const SEED = [
  {
    name: "Ada Lovelace",
    email: "ada@analytical.engine",
    phone: "+44 20 7946 0001",
    company: "Analytical Engines",
  },
  {
    name: "Alan Turing",
    email: "alan@bletchley.park",
    phone: "+44 20 7946 0002",
    company: "Bletchley Park",
  },
  { name: "Grace Hopper", email: "grace@navy.mil", phone: "+1 202 555 0103", company: "US Navy" },
  {
    name: "Katherine Johnson",
    email: "katherine@nasa.gov",
    phone: "+1 757 555 0104",
    company: "NASA Langley",
  },
  {
    name: "Linus Torvalds",
    email: "linus@kernel.org",
    phone: "+1 503 555 0105",
    company: "Linux Foundation",
  },
  {
    name: "Margaret Hamilton",
    email: "margaret@mit.edu",
    phone: "+1 617 555 0106",
    company: "MIT Instrumentation Lab",
  },
  {
    name: "Radia Perlman",
    email: "radia@dec.com",
    phone: "+1 978 555 0107",
    company: "Digital Equipment",
  },
  { name: "Tim Berners-Lee", email: "tim@w3.org", phone: "+41 22 767 0108", company: "CERN" },
  {
    name: "Barbara Liskov",
    email: "barbara@csail.mit.edu",
    phone: "+1 617 555 0109",
    company: "MIT CSAIL",
  },
  {
    name: "Dennis Ritchie",
    email: "dmr@bell-labs.com",
    phone: "+1 908 555 0110",
    company: "Bell Labs",
  },
];

const request = (operation) =>
  new Promise((resolve, reject) => {
    operation.onsuccess = () => resolve(operation.result);
    operation.onerror = () => reject(operation.error);
  });

const database = new Promise((resolve, reject) => {
  const opening = indexedDB.open(DATABASE, 1);
  opening.onupgradeneeded = () => {
    const store = opening.result.createObjectStore(STORE, { keyPath: "id" });
    for (const [index, contact] of SEED.entries()) store.add({ id: String(index + 1), ...contact });
  };
  opening.onsuccess = () => resolve(opening.result);
  opening.onerror = () => reject(opening.error);
});

const store = async (mode) => (await database).transaction(STORE, mode).objectStore(STORE);

const withLink = (contact) => ({
  ...contact,
  url: new URL(`api/contacts/${contact.id}`, self.registration.scope).href,
});

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

const notFound = () => json({ message: "Contact not found." }, 404);

const readBody = async (incoming) => {
  if (incoming.headers.get("content-type")?.includes("json")) return incoming.json();
  return Object.fromEntries(await incoming.formData());
};

const FIELDS = ["name", "email", "phone", "company"];

const clean = (body) =>
  Object.fromEntries(
    FIELDS.filter((field) => field in body).map((field) => [field, String(body[field]).trim()]),
  );

const problems = (contact) => {
  const errors = {};
  if (!contact.name) errors.name = "Name is required.";
  if (contact.email && !EMAIL.test(contact.email)) errors.email = "Enter a valid email address.";
  return errors;
};

const save = async (contact, status) => {
  const errors = problems(contact);
  if (Object.keys(errors).length)
    return json({ message: "Please fix the highlighted fields.", errors }, 422);
  await request((await store("readwrite")).put(contact));
  return json(withLink(contact), status);
};

const matches = (contact, query) =>
  FIELDS.some((field) => (contact[field] ?? "").toLowerCase().includes(query));

const ROUTES = {
  async list(incoming) {
    const query = (new URL(incoming.url).searchParams.get("q") ?? "").trim().toLowerCase();
    const contacts = await request((await store("readonly")).getAll());
    return json(
      contacts
        .filter((contact) => matches(contact, query))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(withLink),
    );
  },
  async create(incoming) {
    const blank = { id: crypto.randomUUID(), name: "", email: "", phone: "", company: "" };
    return save({ ...blank, ...clean(await readBody(incoming)) }, 201);
  },
  async read(_, existing) {
    return json(withLink(existing));
  },
  async update(incoming, existing) {
    return save({ ...existing, ...clean(await readBody(incoming)) }, 200);
  },
  async remove(_, existing) {
    await request((await store("readwrite")).delete(existing.id));
    return json(withLink(existing));
  },
};

const COLLECTION = { GET: ROUTES.list, POST: ROUTES.create };
const MEMBER = {
  GET: ROUTES.read,
  PUT: ROUTES.update,
  PATCH: ROUTES.update,
  DELETE: ROUTES.remove,
};

const handle = async (incoming, id) => {
  await new Promise((resolve) => setTimeout(resolve, LATENCY));
  if (id === undefined)
    return COLLECTION[incoming.method]?.(incoming) ?? json({ message: "Method not allowed." }, 405);
  const existing = await request((await store("readonly")).get(decodeURIComponent(id)));
  if (!existing) return notFound();
  return (
    MEMBER[incoming.method]?.(incoming, existing) ?? json({ message: "Method not allowed." }, 405)
  );
};

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("message", (event) => {
  if (event.data === "claim") event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const match = url.origin === self.location.origin && url.pathname.match(ROUTE);
  if (match) event.respondWith(handle(event.request, match[1]));
});
