import { FORM_PROPERTIES } from "./bindings";
import type { Instance } from "./element";
import { warn } from "./log";
import { type PropType, type Result, toAttributeName } from "./props";
import { effect, reactive } from "./reactivity";

export const attachProps = (instance: Instance, schema: Record<string, PropType>) => {
  if (instance.props)
    throw new Error(`<${instance.host.localName}> called defineProps more than once.`);
  const host = instance.host as unknown as Record<string, unknown> & HTMLElement;
  const tag = host.localName;
  const values = reactive<Record<string, unknown>>({});
  const byAttribute = instance.propAttributes;

  const apply = (key: string, type: PropType, result: Result) => {
    if (result.ok) values[key] = result.value;
    else {
      warn(`<${tag}> prop "${key}" ${result.message}. Using the default.`);
      values[key] = type.fallback;
    }
  };

  // Like a native reset: only form state (value, checked…) goes back to its attribute, so data a page set
  // as a property (an options array, a loader) survives.
  const resetFormValue = () => {
    for (const [attribute, key] of byAttribute)
      if (FORM_PROPERTIES.has(key))
        apply(
          key,
          schema[key] as PropType,
          (schema[key] as PropType).parse(host.getAttribute(attribute)),
        );
  };

  for (const [key, type] of Object.entries(schema)) {
    const attribute = type.rules.attribute ?? toAttributeName(key);
    byAttribute.set(attribute, key);
    const pending = Object.hasOwn(host, key);
    const early = host[key];
    if (pending) delete host[key];
    Object.defineProperty(host, key, {
      configurable: true,
      enumerable: true,
      get: () => values[key],
      set: (value: unknown) => {
        apply(key, type, type.check(value));
        if (!type.rules.reflect) return;
        const text = type.serialize(values[key]);
        if (text === null) host.removeAttribute(attribute);
        else host.setAttribute(attribute, text);
      },
    });
    if (pending) host[key] = early;
    else apply(key, type, type.parse(host.getAttribute(attribute)));
  }

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      const attribute = record.attributeName as string;
      const key = byAttribute.get(attribute) as string;
      const type = schema[key] as PropType;
      const text = host.getAttribute(attribute);
      if (text === type.serialize(values[key])) continue;
      apply(key, type, type.parse(text));
    }
  });
  observer.observe(host, { attributes: true, attributeFilter: [...byAttribute.keys()] });
  instance.disposers.push(() => {
    observer.disconnect();
    for (const key of Object.keys(schema)) delete host[key];
  });

  const { formAssociated } = instance.definition;
  instance.props = new Proxy(values, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);
      return key === "disabled" && formAssociated
        ? Boolean(value) || instance.form.disabled
        : value;
    },
    set(_, key, value) {
      if (typeof key === "string" && Object.hasOwn(schema, key)) host[key] = value;
      else warn(`<${tag}> "${String(key)}" is not a declared prop.`);
      return true;
    },
  });

  if (formAssociated) {
    const checkable = Object.hasOwn(schema, "checked");
    if (checkable || Object.hasOwn(schema, "value")) {
      instance.disposers.push(
        effect(() => {
          const value =
            values.value === undefined || values.value === null ? null : String(values.value);
          instance.internals.setFormValue(
            checkable ? (values.checked ? (value ?? "on") : null) : value,
          );
        }),
      );
    }
    instance.formReset.push(resetFormValue);
    instance.formStateRestore.push((state) => {
      if (checkable) host.checked = state !== null;
      else host.value = state;
    });
  }
  return instance.props;
};
