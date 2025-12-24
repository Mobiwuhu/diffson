import type { PrimitiveComparator } from "./PrimitiveComparator";
import { DiffContext } from "../../model/DiffContext";
import type { PathModule } from "../../model/PathModule";
import { SingleNodeDifference } from "../../model/SingleNodeDifference";
import { DIFFERENT, MERGE_PATH } from "../../model/Constants";
import { jsonElement2Str } from "../types";

export class DefaultPrimitiveComparator implements PrimitiveComparator {
  diff(a: string | number | boolean, b: string | number | boolean, pathModule: PathModule): DiffContext {
    const primitiveDiffContext = new DiffContext();

    if (a !== b) {
      const singleNodeDifferences: SingleNodeDifference[] = [];
      singleNodeDifferences.push(
        new SingleNodeDifference(
          pathModule.getLeftPath().join(MERGE_PATH),
          pathModule.getRightPath().join(MERGE_PATH),
          jsonElement2Str(a),
          jsonElement2Str(b)
        )
      );
      primitiveDiffContext.setDiffResultModels(singleNodeDifferences);
      primitiveDiffContext.setSame(DIFFERENT);
    }
    return primitiveDiffContext;
  }
}
