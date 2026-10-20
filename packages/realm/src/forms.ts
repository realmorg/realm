import type { Instance } from "./element";
import { effect } from "./reactivity";

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const CHECKABLE = new Set(["checkbox", "radio"]);
const SUBMITS_ON_ENTER = new Set(
  "text email password number search tel url date time datetime-local month week".split(" "),
);

export const bindControl = (instance: Instance) => {
  const control = instance.refs.control as Control | undefined;
  if (!instance.definition.formAssociated || !control) return;
  const host = instance.host as unknown as Record<string, unknown> & HTMLElement;
  const keys = new Set(instance.propAttributes.values());
  const checkable = keys.has("checked") && CHECKABLE.has(control.type);
  const numeric = typeof instance.props?.value === "number";

  const validate = () =>
    control.willValidate
      ? instance.internals.setValidity(control.validity, control.validationMessage, control)
      : instance.internals.setValidity({});
  const update = () => {
    if (checkable) host.checked = (control as HTMLInputElement).checked;
    else if (keys.has("value")) host.value = numeric ? Number(control.value) : control.value;
    validate();
  };

  const labels = [...instance.internals.labels]
    .map((label) => (label.textContent as string).trim())
    .join(" ");
  if (labels && !control.hasAttribute("aria-label")) control.setAttribute("aria-label", labels);

  const { signal } = instance;
  control.addEventListener("input", update, { signal });
  control.addEventListener(
    "change",
    () => {
      update();
      host.dispatchEvent(new Event("change", { bubbles: true }));
    },
    { signal },
  );
  control.addEventListener(
    "keydown",
    (event) => {
      const form = instance.internals.form;
      if ((event as KeyboardEvent).key !== "Enter" || !form || !SUBMITS_ON_ENTER.has(control.type))
        return;
      event.preventDefault();
      HTMLFormElement.prototype.requestSubmit.call(form);
    },
    { signal },
  );
  instance.disposers.push(
    effect(() => {
      void instance.props?.value;
      void instance.props?.checked;
      validate();
    }),
  );
};
