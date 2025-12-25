import type { OtherComparator } from "./OtherComparator";
import { DiffContext } from "../../model/DiffContext";
import type { PathModule } from "../../model/PathModule";
import { SingleNodeDifference } from "../../model/SingleNodeDifference";
import { DIFFERENT, MERGE_PATH } from "../../model/Constants";
import { jsonElement2Str, type JsonValue } from "../types";

export class DefaultOtherComparator implements OtherComparator {
  diff(a: JsonValue | undefined, b: JsonValue | undefined, pathModule: PathModule): DiffContext {
    const otherDiffContext = new DiffContext(DIFFERENT);
    const singleNodeDifferences: SingleNodeDifference[] = [];
    singleNodeDifferences.push(
      new SingleNodeDifference(
        pathModule.getLeftPath().join(MERGE_PATH),
        pathModule.getRightPath().join(MERGE_PATH),
        jsonElement2Str(a),
        jsonElement2Str(b)
      )
    );
    otherDiffContext.setDiffResultModels(singleNodeDifferences);
    return otherDiffContext;
  }
}
