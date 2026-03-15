import type { ICompareContext, IPrimitiveComparator } from "../../../contract/type";
import { SingleNodeDifference } from "../../../contract/type";
import { DIFFERENT, MERGE_PATH } from "../../../contract/constant";
import { jsonElement2Str } from "../../../util";

export class DefaultPrimitiveComparator implements IPrimitiveComparator {
  diff(a: string | number | boolean, b: string | number | boolean, context: ICompareContext): ICompareContext {
    const primitiveDiffContext = context.fork();

    if (a !== b) {
      const singleNodeDifferences: SingleNodeDifference[] = [];
      singleNodeDifferences.push(
        new SingleNodeDifference(
          primitiveDiffContext.getLeftPath().join(MERGE_PATH),
          primitiveDiffContext.getRightPath().join(MERGE_PATH),
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
