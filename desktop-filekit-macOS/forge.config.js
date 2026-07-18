const path = require("node:path");

module.exports = {
  packagerConfig: {
    asar: true,

    icon: path.resolve(
      __dirname,
      "src",
      "assets",
      "FileKit"
    ),

    extraResource: [
      path.resolve(__dirname, "resources", "binaries"),
      path.resolve(__dirname, "resources", "runtime"),
      path.resolve(__dirname, "src", "loading.html"),
      path.resolve(__dirname, "src", "assets", "FileKit.png"),
    ],
  },

  rebuildConfig: {},

  makers: [
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
  ],

  plugins: [
    {
      name: "@electron-forge/plugin-webpack",

      config: {
        devContentSecurityPolicy:
          "default-src 'self' data:; " +
          "script-src 'self' 'unsafe-eval'; " +
          "style-src 'self' 'unsafe-inline'; " +
          "connect-src 'self' ws: http:; " +
          "img-src 'self' data:;",

        mainConfig: "./webpack.main.config.js",

        renderer: {
          config: "./webpack.renderer.config.js",

          entryPoints: [
            {
              name: "main_window",
              html: "./src/index.html",
              js: "./src/renderer.js",

              preload: {
                js: "./src/preload.js",
              },
            },
          ],
        },
      },
    },
  ],
};