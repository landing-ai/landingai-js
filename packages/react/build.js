#!/usr/bin/env node

const CssModulesPlugin = require("esbuild-css-modules-plugin");

require("esbuild")
  .build({
    logLevel: "info",
    entryPoints: ["index.tsx"],
    bundle: true,
    outdir: "dist",
    minify: true,
    sourcemap: true,
    packages: 'external',
    platform: 'node',
    plugins: [CssModulesPlugin()],
  })
  .catch(() => process.exit(1));