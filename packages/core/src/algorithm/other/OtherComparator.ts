import type { Comparator } from "../Comparator";
import type { DiffContext } from "../../model/DiffContext";
import type { PathModule } from "../../model/PathModule";
import type { JsonValue } from "../types";

export interface OtherComparator extends Comparator {
  diff(a: JsonValue | undefined, b: JsonValue | undefined, pathModule: PathModule): DiffContext;
}
