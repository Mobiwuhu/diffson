import { Box, Text } from "ink";
import {
  Diff,
  type Result,
  SequentialArrayComparator,
  LeftJoinObjectComparator,
} from "@diffson/core";
import { DiffResult } from "./DiffResult";
import { InteractiveMode } from "./InteractiveMode";

interface AppProps {
  json1?: string;
  json2?: string;
  algorithm?: string;
  ignore?: string[];
  interactive?: boolean;
}

export function App({ json1, json2, algorithm, ignore, interactive }: AppProps) {
  if (interactive) {
    return <InteractiveMode />;
  }

  if (!json1 || !json2) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold color="magenta">
          🔍 Diffson - JSON Diff Tool
        </Text>
        <Box marginTop={1} flexDirection="column">
          <Text>
            <Text bold>Usage:</Text> diffson {"<json1>"} {"<json2>"} [options]
          </Text>
          <Text> </Text>
          <Text bold>Options:</Text>
          <Text>  -a, --algorithm {"<name>"}  Algorithm: default, simple, leftJoin</Text>
          <Text>  -i, --ignore {"<paths>"}    Comma-separated paths to ignore</Text>
          <Text>  --interactive           Interactive mode</Text>
          <Text>  -h, --help              Show help</Text>
          <Text> </Text>
          <Text bold>Examples:</Text>
          <Text color="gray">  diffson '{"{"}"a":1{"}"}' '{"{"}"a":2{"}"}'</Text>
          <Text color="gray">  diffson --interactive</Text>
        </Box>
      </Box>
    );
  }

  let results: Result[];
  let error: string | null = null;

  try {
    const left = JSON.parse(json1);
    const right = JSON.parse(json2);
    let diff = Diff.of(left, right);

    if (ignore && ignore.length > 0) {
      diff = diff.withNoisePath(ignore);
    }

    if (algorithm === "simple") {
      diff = diff.withArrayComparator(new SequentialArrayComparator());
    } else if (algorithm === "leftJoin") {
      diff = diff.withObjectComparator(new LeftJoinObjectComparator());
    }

    results = diff.compare();
  } catch (e) {
    error = (e as Error).message;
    results = [];
  }

  return (
    <Box flexDirection="column" padding={1}>
      {error ? (
        <Box>
          <Text color="red">Error: {error}</Text>
        </Box>
      ) : (
        <DiffResult results={results} />
      )}
    </Box>
  );
}
