import fs from "node:fs";
import path from "node:path";
import { defineConfig, Options } from "tsup";

//#region terser config
const REGEX_PIPE_SEPARATOR = "|";
const getterDOMUtils = [
  "attr",
  "attrs",
  "attrsKv",
  "children",
  "clone",
  "CSSvar",
  "data",
  "el",
  "els",
  "hasAttr",
  "host",
  "html",
  "id",
  "name",
  "nodes",
  "parent",
  "parentNode",
  "qs",
  "qsAll",
  "qsString",
  "randId",
  "root",
  "shadow",
  "shadowEl",
  "shadowEls",
  "slotAttrName",
  "slotStateName",
  "tagName",
];

const setterDOMUtils = [
  "addCSS",
  "addCustomEvent",
  "addEvent",
  "append",
  "attach",
  "attachStyle",
  "attr",
  "attrs",
  "clear",
  "content",
  "createElement",
  "createFragment",
  "CSSvar",
  "data",
  "datas",
  "debug",
  "html",
  "remove",
  "removeAttr",
  "removeEvent",
  "renderShadow",
  "renderStyle",
  "renderTemplate",
  "replace",
  "reqAnimFrame",
  "sendEvent",
  "setCSSProperty",
  "slotTo",
];
const methodOrObjectKeys = [
  "onAttributeChanged",
  "onBeforeInit",
  "onBeforeRegister",
  "onConnected",
  "onApply",
  "onRemove",
  "onInit",
  "onMounted",
  "onRegistered",
  "onTrigger",
  "onUnmounted",
  "shadow",
  "statesRegistry",
  "attrsRegistry",
  "states",
  "set",
  "get",
  "requiredAttrs",
  "subscribe",
  "callback",
  "ACTION",
  "ADD_STR",
  "ADD",
  "ARRAY",
  "ASSIGN",
  "ASYNC",
  "ATTR_UPDATED",
  "BOOLEAN",
  "CHILDREN",
  "DEBOUNCE",
  "DEBUG",
  "DEFER",
  "DIVIDE",
  "ELEMENT",
  "EQUALS_TO",
  "EVERY",
  "FROM",
  "GLOBAL",
  "HREF",
  "HTML",
  "HTTP_REQUEST",
  "HTTP_URL",
  "INDEX",
  "IS_LOADED",
  "JSON_STRING",
  "LISTEN_EVENT",
  "METHOD",
  "MODULE",
  "MOUNT",
  "MOUNTED",
  "MULTIPLY",
  "MUTATE",
  "NAME",
  "NUMBER",
  "OBJECT",
  "OF",
  "ONCE",
  "POP",
  "PUSH",
  "REF",
  "REL",
  "REMOVE",
  "REQUEST_BODY",
  "REQUEST_HEADER",
  "RESPONSE_ERROR",
  "RESPONSE_SUCCESS",
  "SCRIPT_ID",
  "SCRIPT",
  "SEND_EVENT",
  "SET_ATTR",
  "SET_STATE",
  "SET_TIMER",
  "SLOT",
  "SRC",
  "STATE_UPDATED",
  "STORAGE",
  "STRING",
  "SUBTRACT",
  "TO",
  "TOGGLE",
  "TRIGGER_ELEMENT",
  "TRIGGER_EVENT",
  "TYPE",
  "VALUE",
];
const getterDOMUtilRegex = `\\$(${getterDOMUtils.join(REGEX_PIPE_SEPARATOR)})`;
const setterDOMUtilsRegex = `_(${setterDOMUtils.join(REGEX_PIPE_SEPARATOR)})`;
const methodOrObjectKeysRegex = methodOrObjectKeys.join(REGEX_PIPE_SEPARATOR);
const mangleRegexProps = [
  methodOrObjectKeysRegex,
  getterDOMUtilRegex,
  setterDOMUtilsRegex,
];
const regex = new RegExp(`^(${mangleRegexProps.join(REGEX_PIPE_SEPARATOR)})$`);
console.log({ regex });
const terserOptions: Options["terserOptions"] = {
  enclose: true,
  compress: {
    hoist_funs: true,

    booleans_as_integers: true,
    unsafe: true,
    arguments: true,
    toplevel: false,
    passes: 10000,
  },
  mangle: {
    properties: {
      regex,
    },
  },
  format: {
    wrap_func_args: false,
  },
};
//#endregion

//#region directory
const buildEnv = process?.env?.NODE_ENV ?? "development";
const isProduction = buildEnv === "production";
const DIST_DIR = path.resolve(__dirname, "dist");
const banner = fs.readFileSync("./BANNER.txt").toString();
const buildPath = path.join(
  DIST_DIR,
  `realm.${isProduction ? buildEnv + ".min" : buildEnv}.js`
);
//#endregion

export default defineConfig({
  clean: !isProduction,
  sourcemap: isProduction,
  banner: { css: banner, js: banner },
  minify: isProduction ? "terser" : false,
  terserOptions,
  esbuildOptions(options) {
    options.outdir = undefined;
    options.outfile = buildPath;
  },
});
