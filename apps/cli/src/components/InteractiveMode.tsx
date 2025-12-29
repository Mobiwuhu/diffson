import React, { useState } from "react";
import { Box, Text, useInput, useApp } from "ink";
import TextInput from "ink-text-input";
import { createDiffService, type Result } from "@diffson/core";
import { DiffResult } from "./DiffResult.js";

type Step = "json1" | "json2" | "result";

export function InteractiveMode() {
  const { exit } = useApp();
  const [step, setStep] = useState<Step>("json1");
  const [json1, setJson1] = useState("");
  const [json2, setJson2] = useState("");
  const [results, setResults] = useState<Result[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useInput((input, key) => {
    if (key.escape) {
      exit();
    }
    if (step === "result" && (input === "r" || input === "R")) {
      setStep("json1");
      setJson1("");
      setJson2("");
      setResults(null);
      setError(null);
    }
    if (step === "result" && (input === "q" || input === "Q")) {
      exit();
    }
  });

  const handleJson1Submit = (value: string) => {
    setJson1(value);
    setStep("json2");
  };

  const handleJson2Submit = (value: string) => {
    setJson2(value);
    try {
      const left = JSON.parse(json1);
      const right = JSON.parse(value);
      const diffService = createDiffService();
      const diff = diffService.compare(left, right);
      setResults(diff);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setResults(null);
    }
    setStep("result");
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="magenta">
          🔍 Diffson - Interactive JSON Diff
        </Text>
      </Box>

      {step === "json1" && (
        <Box flexDirection="column">
          <Text color="cyan">Enter first JSON:</Text>
          <Box>
            <Text color="gray">{"› "}</Text>
            <TextInput value={json1} onChange={setJson1} onSubmit={handleJson1Submit} />
          </Box>
        </Box>
      )}

      {step === "json2" && (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text color="gray">JSON 1: </Text>
            <Text>{json1}</Text>
          </Box>
          <Text color="cyan">Enter second JSON:</Text>
          <Box>
            <Text color="gray">{"› "}</Text>
            <TextInput value={json2} onChange={setJson2} onSubmit={handleJson2Submit} />
          </Box>
        </Box>
      )}

      {step === "result" && (
        <Box flexDirection="column">
          <Box marginBottom={1} flexDirection="column">
            <Box>
              <Text color="gray">JSON 1: </Text>
              <Text>{json1}</Text>
            </Box>
            <Box>
              <Text color="gray">JSON 2: </Text>
              <Text>{json2}</Text>
            </Box>
          </Box>

          {error ? (
            <Box>
              <Text color="red">Error: {error}</Text>
            </Box>
          ) : results ? (
            <DiffResult results={results} />
          ) : null}

          <Box marginTop={1}>
            <Text color="gray">
              Press <Text color="cyan">R</Text> to restart, <Text color="cyan">Q</Text> to quit,{" "}
              <Text color="cyan">ESC</Text> to exit
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
