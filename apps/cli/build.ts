#!/usr/bin/env bun

/**
 * Build script for @diffson/cli
 * Uses Bun's native bundler for optimized output
 */

import { join } from "node:path";

const entrypoint = join(import.meta.dir, "src/index.tsx");
const outdir = join(import.meta.dir, "dist");

const result = await Bun.build({
  entrypoints: [entrypoint],
  outdir,
  naming: {
    entry: "index.js",
  },
  target: 'bun',
  format: 'esm',
  minify: {
    whitespace: true,
    identifiers: true,
    syntax: true,
  },
  splitting: false, // Single file output for CLI
  sourcemap: 'none',
  external: [
    '@clack/prompts',
  ],
});

if (!result.success) {
  console.error('Build failed:');
  for (const message of result.logs) {
    console.error(message);
  }
  process.exit(1);
}

console.log('✓ Build completed successfully');
console.log(`  Generated ${result.outputs.length} file(s)`);

for (const output of result.outputs) {
  const size = (output.size / 1024).toFixed(2);
  console.log(`  - ${output.path} (${size} KB)`);
}
