import type { ICompareContext, INullComparator } from "../../../contract/type";

export class DefaultNullComparator implements INullComparator {
  diff(_a: null, _b: null, context: ICompareContext): ICompareContext {
    return context.fork();
  }
}
