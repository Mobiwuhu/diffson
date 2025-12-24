import type { Comparator } from "../Comparator";
import type { DiffContext } from "../../model/DiffContext";
import type { PathModule } from "../../model/PathModule";

export interface NullComparator extends Comparator {
  diff(a: null, b: null, pathModule: PathModule): DiffContext;
}
