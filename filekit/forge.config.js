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
      path.resolve(
        __dirname,
        "resources",
        "binaries"
      ),
      path.resolve(
        __dirname,
        "resources",
        "runtime"
      ),
    ],
  },

  rebuildConfig: {},

  makers: [
    {
      name: "@electron-forge/maker-squirrel",

      config: {
        name: "filekit",
        authors: "Er. P. Rohit V. Acharya",
        description:
          "A modern file management and analytics application",

        exe: "FileKit.exe",
        setupExe: "FileKit-Setup.exe",

        setupIcon: path.resolve(
          __dirname,
          "src",
          "assets",
          "FileKit.ico"
        ),

        noMsi: true,
      },
    },

    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },

    {
      name: "@electron-forge/maker-deb",
      config: {},
    },

    {
      name: "@electron-forge/maker-rpm",
      config: {},
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
              html: "./src/index.html",
              js: "./src/renderer.js",
              name: "main_window",

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