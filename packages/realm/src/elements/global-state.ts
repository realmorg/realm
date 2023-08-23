import { RealmAttributeNames } from "../constants/attrs";
import { MixedDataType } from "../constants/data";
import { RealmTagNames } from "../constants/tags";
import { RealmState, StateStorage } from "../libs/RealmState.class";
import { WindowWithCustomType, win } from "../utils/dom";
import {
  ElementAttributeEntries,
  ElementDataTypes,
  parseValue,
  defineElement,
} from "../utils/element";
import {
  addSet,
  arrayMap,
  createArray,
  createSet,
  findArray,
} from "../utils/object";

const globalState = ((
  win as WindowWithCustomType<{ globalState: RealmState }>
).globalState = new RealmState());

const GLOBAL_STATE_REGISTRY = createSet<ElementAttributeEntries>();

export const getGlobalStateRegistry = () => GLOBAL_STATE_REGISTRY;

const findGlobalStateRegistry = (name: string) =>
  findArray(
    createArray<ElementAttributeEntries>(GLOBAL_STATE_REGISTRY),
    ([stateName]) => stateName === name
  );

export const getGlobalStateType = (name: string) =>
  findGlobalStateRegistry(name)?.at(1) as ElementDataTypes;

const getGlobalStateStorage = (name: string): StateStorage => {
  const options = findGlobalStateRegistry(name)?.at(3) as Record<
    string,
    StateStorage
  >;
  return options?.storage ?? StateStorage.MEMORY;
};

export const getGlobalState = () => globalState;

const getGlobalStateValue = (name?: string): MixedDataType =>
  globalState.get(name, getGlobalStateStorage(name));

export const updateGlobalState = (name: string, value: unknown) =>
  globalState.set(name, value, getGlobalStateStorage(name));

export const globalStateElement = defineElement({
  name: RealmTagNames.GLOBAL_STATE,

  onBeforeInit(element) {
    const [name, type, storage] = arrayMap<string, string>(
      [
        RealmAttributeNames.NAME,
        RealmAttributeNames.TYPE,
        RealmAttributeNames.STORAGE,
      ],
      (item) => element.$attr(item)
    );
    const value = parseValue(<ElementDataTypes>type, element.$html());
    addSet(GLOBAL_STATE_REGISTRY, [name, type, value, { storage }]);
    updateGlobalState(name, getGlobalStateValue(name) ?? value);
  },

  onMounted(element) {
    element._remove();
  },
});
