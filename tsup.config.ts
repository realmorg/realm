import { defineConfig } from "tsup";

export default defineConfig({
  terserOptions: {
    enclose: true,
    compress: {
      booleans_as_integers: true,
      unsafe: true,
    },
    mangle: {
      properties: {
        regex:
          /^(onInit|onMounted|onUnmounted|onAttrsUpdate|onLocalStatesUpdate|onRegistered|onPrepare|onAttributeChanged|_clear|_html|_content|_attach|_append|_render|_remove|_createTag|_attrs|_attr|_data|_datas|_reqAnimFrame|_slotTo|\$randId|\$html|\$qs|\$qsAll|\$qsString|\$children|\$attr|\$el|\$els|\$shadowEl|\$shadowEls|\$slotAttrName|\$slotStateName|setItem|getItem|subscribe|TRIGGER)$/,
      },
    },
  },
});
