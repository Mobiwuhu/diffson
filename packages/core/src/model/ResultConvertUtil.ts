import { DiffContext } from "./DiffContext";
import { Result } from "./Result";
import { SingleNodeDifference } from "./SingleNodeDifference";

export const OBJECT_NULL = null;
export const TYPE_MODIFY = "MODIFY";
export const TYPE_ADD = "ADD";
export const TYPE_DELETE = "DELETE";

export function constructResult(diffContext: DiffContext): Result[] {
  const list: Result[] = [];

  for (const resultModel of diffContext.getDiffResultModels()) {
    const printModel = convert(resultModel);
    const leftAndRightBothNull =
      resultModel.left === OBJECT_NULL && resultModel.right === OBJECT_NULL;

    if (leftAndRightBothNull) {
      printModel.diffType = TYPE_MODIFY;
    } else if (resultModel.left === OBJECT_NULL) {
      printModel.diffType = TYPE_ADD;
      printModel.leftPath = null;
    } else if (resultModel.right === OBJECT_NULL) {
      printModel.diffType = TYPE_DELETE;
      printModel.rightPath = null;
    } else {
      printModel.diffType = TYPE_MODIFY;
    }
    list.push(printModel);
  }
  return list;
}

function convert(resultModel: SingleNodeDifference): Result {
  const printModel = new Result();
  printModel.left = resultModel.left;
  printModel.right = resultModel.right;
  printModel.leftPath = resultModel.leftPath;
  printModel.rightPath = resultModel.rightPath;
  return printModel;
}
