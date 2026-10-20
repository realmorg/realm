export const blankContact = () => ({ name: "", email: "", phone: "", company: "" });

const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export const toRow = (contact) => ({
  ...contact,
  initials: initials(contact.name),
  mailto: contact.email ? `mailto:${contact.email}` : null,
  editLabel: `Edit ${contact.name}`,
  deleteLabel: `Delete ${contact.name}`,
});
