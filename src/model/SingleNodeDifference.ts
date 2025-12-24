export class SingleNodeDifference {
  leftPath: string;
  rightPath: string;
  left: unknown;
  right: unknown;

  constructor(leftPath: string, rightPath: string, left: unknown, right: unknown) {
    this.leftPath = leftPath;
    this.rightPath = rightPath;
    this.left = left;
    this.right = right;
  }
}
