import type { ICompareContext, IOtherComparator, JsonValue } from "../../../contract/type";
import { SingleNodeDifference } from "../../../contract/type";
import { DIFFERENT, MERGE_PATH } from "../../../contract/constant";
import { jsonElement2Str } from "../../../util";

export class DefaultOtherComparator implements IOtherComparator {
  diff(a: JsonValue | undefined, b: JsonValue | undefined, context: ICompareContext): ICompareContext {
    const otherDiffContext = context.fork();
    const singleNodeDifferences: SingleNodeDifference[] = [];
    singleNodeDifferences.push(
      new SingleNodeDifference(
        otherDiffContext.getLeftPath().join(MERGE_PATH),
        otherDiffContext.getRightPath().join(MERGE_PATH),
        jsonElement2Str(a),
        jsonElement2Str(b)
      )
    );
    otherDiffContext.setDiffResultModels(singleNodeDifferences);
    otherDiffContext.setSame(DIFFERENT);
    return otherDiffContext;
  }
}
