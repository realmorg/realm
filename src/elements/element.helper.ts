import { RealmElement } from "../libs/RealmElement.class";

export interface CreateElementParams {
  onRegistered?: (customElementName: string) => void;
  onPrepare?: (element: RealmElement) => void;
  onInit?: (element: RealmElement) => void;
  onMounted?: (element: RealmElement) => void;
  onUnmounted?: (element: RealmElement) => void;
}

export const registerElement =
  (name: string, { onRegistered, ...params }: CreateElementParams) =>
  () => {
    const isNameValid = name.includes("-");
    const isDefined = customElements.get(name);
    if (!isNameValid || isDefined)
      throw new Error(`Element ${name} has invalid name or already defined`);

    customElements.whenDefined(name).then(() => onRegistered?.(name));
    customElements.define(
      name,
      class extends RealmElement {
        constructor() {
          super({ name, ...params });
        }
      }
    );
  };
