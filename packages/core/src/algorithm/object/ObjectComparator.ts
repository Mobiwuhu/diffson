import type { Comparator } from "../Comparator";
import type { DiffContext } from "../../model/DiffContext";
import type { PathModule } from "../../model/PathModule";
import type { JsonObject, JsonValue } from "../types";
import type { AlgorithmModule } from "../AlgorithmModule";

export interface ObjectComparator extends Comparator {
  diff(a: JsonObject, b: JsonObject, pathModule: PathModule): DiffContext;
  diffElement(a: JsonValue | undefined, b: JsonValue | undefined, pathModule: PathModule): DiffContext;
  constructAlgorithmModule(algorithmModule: AlgorithmModule): void;
}
