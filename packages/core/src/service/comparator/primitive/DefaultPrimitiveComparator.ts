import type { PrimitiveComparator } from "./PrimitiveComparator";
import { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "../../diff/PathTracker";
import { SingleNodeDifference } from "../../../contract/type";
import { DIFFERENT, MERGE_PATH } from "../../../contract/constant";
import { jsonElement2Str } from "../../../util";

export class DefaultPrimitiveComparator implements PrimitiveComparator {
  diff(a: string | number | boolean, b: string | number | boolean, pathTracker: PathTracker): DiffContext {
    const primitiveDiffContext = new DiffContext();

    if (a !== b) {
      const singleNodeDifferences: SingleNodeDifference[] = [];
      singleNodeDifferences.push(
        new SingleNodeDifference(
          pathTracker.getLeftPath().join(MERGE_PATH),
          pathTracker.getRightPath().join(MERGE_PATH),
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
