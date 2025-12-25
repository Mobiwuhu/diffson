import type { Comparator } from "../Comparator";
import type { DiffContext } from "../../model/DiffContext";
import type { PathModule } from "../../model/PathModule";
import type { JsonArray, JsonValue } from "../types";
import type { AlgorithmModule } from "../AlgorithmModule";

export interface ArrayComparator extends Comparator {
  diffArray(a: JsonArray, b: JsonArray, pathModule: PathModule): DiffContext;
  diffElement(a: JsonValue | undefined, b: JsonValue | undefined, pathModule: PathModule): DiffContext;
  constructAlgorithmModule(algorithmModule: AlgorithmModule): void;
}
