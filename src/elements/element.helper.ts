import { RealmElement } from "../libs/RealmElement.class";

export interface CreateElementParams {
  onRegistered?: (elementName: string) => void;
  onPrepare?: (element: RealmElement) => void;
  onInit?: (element: RealmElement) => void;
  onMounted?: (element: RealmElement) => void;
  onUnmounted?: (element: RealmElement) => void;
}

export const registerElement =
  (elementName: string, { onRegistered, ...params }: CreateElementParams) =>
  () => {
    const isNameValid = elementName.includes("-");
    const isDefined = customElements.get(elementName);
    if (!isNameValid || isDefined)
      throw new Error(
        `Element ${elementName} has invalid name or already defined`
      );

    customElements
      .whenDefined(elementName)
      .then(() => onRegistered?.(elementName));

    customElements.define(
      elementName,
      class extends RealmElement {
        constructor() {
          super({ name: elementName, ...params });
        }
      }
    );
  };
