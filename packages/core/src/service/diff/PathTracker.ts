export class PathTracker {
  private leftPath: string[];
  private rightPath: string[];
  private specialPath: string[] | null;
  private noisePahList: string[] | null;

  constructor(noisePahList: string[] | null = null, specialPath: string[] | null = null) {
    this.leftPath = [];
    this.rightPath = [];
    this.noisePahList = noisePahList;
    this.specialPath = specialPath;
  }

  getNoisePahList(): string[] | null {
    return this.noisePahList;
  }

  setNoisePahList(noisePahList: string[]): void {
    this.noisePahList = noisePahList;
  }

  getSpecialPath(): string[] | null {
    return this.specialPath;
  }

  setSpecialPath(specialPath: string[]): void {
    this.specialPath = specialPath;
  }

  getLeftPath(): string[] {
    return this.leftPath;
  }

  setLeftPath(leftPath: string[]): void {
    this.leftPath = leftPath;
  }

  getRightPath(): string[] {
    return this.rightPath;
  }

  setRightPath(rightPath: string[]): void {
    this.rightPath = rightPath;
  }

  addAllpath(lastPath: string): void {
    this.leftPath.push(lastPath);
    this.rightPath.push(lastPath);
  }

  addLeftPath(lastPath: string): void {
    this.leftPath.push(lastPath);
  }

  addRightPath(lastPath: string): void {
    this.rightPath.push(lastPath);
  }

  removeAllLastPath(): void {
    this.leftPath.pop();
    this.rightPath.pop();
  }

  removeLastLeftPath(): void {
    this.leftPath.pop();
  }

  removeLastRightPath(): void {
    this.rightPath.pop();
  }
}
