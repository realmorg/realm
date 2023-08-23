const fs = require("node:fs");
const banner = fs.readFileSync("./BANNER.txt").toString();

module.exports = {
  plugins: [
    require("cssnano")({
      preset: "default",
    }),
    require("postcss-header")({
      banner,
    }),
  ],
};
