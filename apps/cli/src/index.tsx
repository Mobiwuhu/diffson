#!/usr/bin/env bun
import React from "react";
import { render } from "ink";
import { App } from "./components/App";

const args = process.argv.slice(2);

function parseArgs(args: string[]) {
  const result: {
    json1?: string;
    json2?: string;
    help?: boolean;
    interactive?: boolean;
  } = {};

  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--interactive" || arg === "-I") {
      result.interactive = true;
    } else if (!result.json1) {
      result.json1 = arg;
    } else if (!result.json2) {
      result.json2 = arg;
    }
    i++;
  }
  return result;
}

const parsed = parseArgs(args);

render(
  <App
    json1={parsed.json1}
    json2={parsed.json2}
    interactive={parsed.interactive}
  />
);
