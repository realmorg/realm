import { RealmAttributeNames } from "../constants/attrs";
import { RealmTagNames } from "../constants/tags";
import { defineElement } from "../utils/element";

export const webAppElement = defineElement({
  name: RealmTagNames.WEB_APP,

  onMounted(element) {
    element._attr(RealmAttributeNames.IS_LOADED, true);
  },
});
