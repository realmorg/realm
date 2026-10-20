import { defineStore } from "https://cdn.jsdelivr.net/npm/@realmorg/realm@alpha/dist/realm.js";

const clock = new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" });

export const now = () => clock.format(new Date());

const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

const file = (name, size, text) => ({
  name,
  size,
  href: `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`,
});

const message = (from, text, time, attachment = null) => ({
  id: crypto.randomUUID(),
  from,
  text,
  time,
  attachment,
});

// Each contact answers with the next line of their script, then starts again.
const REPLIES = {
  ana: [
    "Sounds good to me.",
    "Can you send the draft before lunch?",
    "Perfect, I'll review it this afternoon.",
  ],
  ben: ["Ha, classic.", "On it.", "Let me check and get back to you."],
  chloe: ["Thanks! 🙌", "I'll bring snacks.", "See you there."],
  dev: ["Merged.", "CI is green now.", "Shipping it after the standup."],
};

const conversation = (id, name, status, unread, messages) => ({
  id,
  name,
  initials: initials(name),
  status,
  unread,
  typing: false,
  replies: 0,
  messages,
});

export const chat = defineStore("example-chat", {
  conversations: [
    conversation("ana", "Ana Lopez", "Product designer", 0, [
      message("them", "Morning! Did you get a chance to look at the onboarding flow?", "9:12 AM"),
      message("me", "Yes, I left a few comments on the second screen.", "9:20 AM"),
      message(
        "them",
        "Great, here are the updated mockups.",
        "9:24 AM",
        file("onboarding-v3.txt", "2 KB", "Onboarding flow, version 3"),
      ),
    ]),
    conversation("ben", "Ben Carter", "Support lead", 2, [
      message("them", "A customer asked for a dark mode export.", "Yesterday"),
      message("them", "Is that on the roadmap?", "Yesterday"),
    ]),
    conversation("chloe", "Chloe Park", "Office manager", 1, [
      message("them", "Team lunch is on Friday at 12:30.", "Mon"),
    ]),
    conversation("dev", "Dev Patel", "Engineer", 0, [
      message("me", "Can you review my pull request?", "Sun"),
      message(
        "them",
        "Sure, attaching my notes.",
        "Sun",
        file("review-notes.txt", "1 KB", "Looks good. Two small nits inline."),
      ),
    ]),
  ],
  activeId: "ana",
  thread: false,
  query: "",
  get active() {
    return this.conversations.find((item) => item.id === this.activeId);
  },
  get list() {
    const query = this.query.trim().toLowerCase();
    return this.conversations
      .filter((item) => item.name.toLowerCase().includes(query))
      .map((item) => {
        const last = item.messages.at(-1);
        return {
          ...item,
          current: item.id === this.activeId,
          preview: item.typing ? "typing…" : `${last.from === "me" ? "You: " : ""}${last.text}`,
          time: last.time,
          hasUnread: item.unread > 0,
        };
      });
  },
  get unread() {
    return this.conversations.reduce((total, item) => total + item.unread, 0);
  },
  get title() {
    return `${this.unread ? `(${this.unread}) ` : ""}Chat · REALM examples`;
  },
  get messages() {
    const active = this.active;
    return active.messages.map((item) => ({
      ...item,
      mine: item.from === "me",
      align: item.from === "me" ? "end" : "start",
      variant: item.from === "me" ? "default" : "muted",
      initials: item.from === "me" ? "ME" : active.initials,
      sender: item.from === "me" ? "You" : active.name,
    }));
  },
  get status() {
    return this.active.typing ? "typing…" : this.active.status;
  },
});

export const open = (id) => {
  chat.activeId = id;
  chat.active.unread = 0;
  chat.thread = true;
};

const SIZES = ["B", "KB", "MB", "GB"];

const humanSize = (bytes) => {
  const power = Math.min(Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(1024)), 3);
  return `${Math.round(bytes / 1024 ** power)} ${SIZES[power]}`;
};

export const attachmentFor = (picked) =>
  picked
    ? { name: picked.name, size: humanSize(picked.size), href: URL.createObjectURL(picked) }
    : null;

export const outgoing = (text, attachment) => {
  const body = text.trim();
  if (!body && !attachment) return null;
  return message("me", body, now(), attachment);
};

export const reply = (target) => {
  const lines = REPLIES[target.id];
  target.messages.push(message("them", lines[target.replies % lines.length], now()));
  target.replies++;
  target.typing = false;
  if (target.id !== chat.activeId) target.unread++;
};
