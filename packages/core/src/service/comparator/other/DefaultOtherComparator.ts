import type { OtherComparator } from "./OtherComparator";
import { DiffContext } from "../../diff/DiffContext";
import type { PathTracker } from "../../diff/PathTracker";
import { SingleNodeDifference } from "../../../contract/type";
import { DIFFERENT, MERGE_PATH } from "../../../contract/constant";
import { jsonElement2Str } from "../../../util";
import type { JsonValue } from "../../../contract/type";

export class DefaultOtherComparator implements OtherComparator {
  diff(a: JsonValue | undefined, b: JsonValue | undefined, pathTracker: PathTracker): DiffContext {
    const otherDiffContext = new DiffContext(DIFFERENT);
    const singleNodeDifferences: SingleNodeDifference[] = [];
    singleNodeDifferences.push(
      new SingleNodeDifference(
        pathTracker.getLeftPath().join(MERGE_PATH),
        pathTracker.getRightPath().join(MERGE_PATH),
        jsonElement2Str(a),
        jsonElement2Str(b)
      )
    );
    otherDiffContext.setDiffResultModels(singleNodeDifferences);
    return otherDiffContext;
  }
}
