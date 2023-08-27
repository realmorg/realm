import { RealmBase } from "./RealmBase.class";
import { RealmState } from "./RealmState.class";
import {
  ElementAttributeEntries,
  subscribeAttrMutation,
} from "../utils/element";
import { arrayPush, createSet, forEach } from "../utils/object";
import { reqAnim } from "../utils/timer";

type RealmElementAttrMutationCallback = (
  attrName: string,
  attrValue: unknown,
  prevAttrValue: unknown
) => void;

interface ReamlElementParams {
  name: string;
  onBeforeInit?: (element: HTMLElement) => void;
  onInit?: (element: HTMLElement) => void;
  onMounted?: (element: HTMLElement) => void;
  onUnmounted?: (element: HTMLElement) => void;
  onAttributeChanged?: (
    element: HTMLElement,
    attrName: string,
    attrValue: unknown,
    prevAttrValue: unknown
  ) => void;
}

export class RealmElement extends RealmBase {
  onInit?: ReamlElementParams["onInit"];
  onMounted?: ReamlElementParams["onMounted"];
  onUnmounted?: ReamlElementParams["onUnmounted"];
  onAttributeChanged?: ReamlElementParams["onAttributeChanged"];
  states: RealmState = new RealmState();
  statesRegistry = createSet<ElementAttributeEntries>();
  attrsRegistry = createSet<ElementAttributeEntries>();
  #attrObserver: Array<RealmElementAttrMutationCallback> = [];

  constructor({
    name,
    onInit,
    onBeforeInit,
    onMounted,
    onUnmounted,
    onAttributeChanged,
  }: ReamlElementParams) {
    super();

    this.name = name;
    this.id = this.$randId();
    this.onMounted = onMounted;
    this.onUnmounted = onUnmounted;
    this.onAttributeChanged = onAttributeChanged;

    onBeforeInit?.(this);
    this._html(this.$html());
    onInit?.(this);
    reqAnim(() => this.onMounted?.(this));
  }

  subscribe(callback: RealmElementAttrMutationCallback) {
    arrayPush(this.#attrObserver, callback);
  }

  async connectedCallback() {
    const [observeAttr] = subscribeAttrMutation(
      this,
      (attrName, attrValue, prevAttrValue) => {
        forEach(this.#attrObserver, (callback) =>
          callback?.(attrName, attrValue, prevAttrValue)
        );
        this.onAttributeChanged?.(this, attrName, attrValue, prevAttrValue);
      }
    );
    observeAttr();
  }

  disconnectedCallback() {
    this.onUnmounted?.(this);
  }
}
