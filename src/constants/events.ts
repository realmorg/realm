export enum RealmEventTypes {
  RUNTIME_READY = "rr",
  SCRIPT_ADDED = "sa",
}

export enum RealmRuntimeEventTypes {
  INIT = "onInit",
  MOUNTED = "onMounted",
  UNMOUNTED = "onUnmounted",
  ATTR_UPDATE = "onAttrsUpdate",
  STATES_UPDATE = "onLocalStatesUpdate",
  ON = "on",
}

export enum RealmEventAliases {
  TRIGGER = "trigger",
}
