import { Box, Text } from "ink";
import { TYPE_ADD, TYPE_DELETE, TYPE_MODIFY, type Result } from "@diffson/core";

interface DiffItemProps {
  item: Result;
}

function DiffItem({ item }: DiffItemProps) {
  const getColor = () => {
    switch (item.diffType) {
      case TYPE_ADD:
        return "green";
      case TYPE_DELETE:
        return "red";
      case TYPE_MODIFY:
        return "yellow";
      default:
        return "white";
    }
  };

  const getSymbol = () => {
    switch (item.diffType) {
      case TYPE_ADD:
        return "+";
      case TYPE_DELETE:
        return "-";
      case TYPE_MODIFY:
        return "~";
      default:
        return "?";
    }
  };

  const path = item.leftPath ?? item.rightPath ?? "(root)";

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text color={getColor()} bold>
          {getSymbol()}
        </Text>
        <Text> </Text>
        <Text color="cyan">{path}</Text>
      </Box>
      {item.diffType === TYPE_DELETE && (
        <Box marginLeft={4}>
          <Text color="red">- {String(item.left)}</Text>
        </Box>
      )}
      {item.diffType === TYPE_ADD && (
        <Box marginLeft={4}>
          <Text color="green">+ {String(item.right)}</Text>
        </Box>
      )}
      {item.diffType === TYPE_MODIFY && (
        <>
          <Box marginLeft={4}>
            <Text color="red">- {String(item.left)}</Text>
          </Box>
          <Box marginLeft={4}>
            <Text color="green">+ {String(item.right)}</Text>
          </Box>
        </>
      )}
    </Box>
  );
}

interface DiffResultProps {
  results: Result[];
}

export function DiffResult({ results }: DiffResultProps) {
  if (results.length === 0) {
    return (
      <Box>
        <Text color="green" bold>
          ✓ No differences found
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>
          Found {results.length} difference{results.length > 1 ? "s" : ""}:
        </Text>
      </Box>
      {results.map((item, index) => (
        <DiffItem key={index} item={item} />
      ))}
    </Box>
  );
}
