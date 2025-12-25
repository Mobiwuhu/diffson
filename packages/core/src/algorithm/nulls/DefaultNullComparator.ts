import type { NullComparator } from "./NullComparator";
import { DiffContext } from "../../model/DiffContext";
import type { PathModule } from "../../model/PathModule";

export class DefaultNullComparator implements NullComparator {
  diff(_a: null, _b: null, _pathModule: PathModule): DiffContext {
    return new DiffContext();
  }
}
