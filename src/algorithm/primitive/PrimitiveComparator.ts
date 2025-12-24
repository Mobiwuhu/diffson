import type { Comparator } from "../Comparator";
import type { DiffContext } from "../../model/DiffContext";
import type { PathModule } from "../../model/PathModule";

export interface PrimitiveComparator extends Comparator {
  diff(a: string | number | boolean, b: string | number | boolean, pathModule: PathModule): DiffContext;
}
