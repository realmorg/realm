import { RealmTagNames } from "../constants/tags";
import { registerElement } from "../utils/element";

export const webAppElement = registerElement(RealmTagNames.WEB_APP, {
  onMounted() {
    console.log("web-app mounted");
  },

  onUnmounted() {
    console.log("web-app unmounted");
  },
});
