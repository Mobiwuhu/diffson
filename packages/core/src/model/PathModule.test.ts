import { describe, expect, test } from "bun:test";
import { PathModule } from "./PathModule";

describe("PathModule", () => {
  test("constructor initializes paths", () => {
    const pathModule = new PathModule();
    expect(pathModule.getLeftPath()).toEqual([]);
    expect(pathModule.getRightPath()).toEqual([]);
  });

  test("constructor with noise path list", () => {
    const noiseList = ["a", "b"];
    const pathModule = new PathModule(noiseList);
    expect(pathModule.getNoisePahList()).toEqual(noiseList);
  });

  test("addAllpath adds to both paths", () => {
    const pathModule = new PathModule();
    pathModule.addAllpath("test");
    expect(pathModule.getLeftPath()).toEqual(["test"]);
    expect(pathModule.getRightPath()).toEqual(["test"]);
  });

  test("addLeftPath adds only to left", () => {
    const pathModule = new PathModule();
    pathModule.addLeftPath("left");
    expect(pathModule.getLeftPath()).toEqual(["left"]);
    expect(pathModule.getRightPath()).toEqual([]);
  });

  test("addRightPath adds only to right", () => {
    const pathModule = new PathModule();
    pathModule.addRightPath("right");
    expect(pathModule.getLeftPath()).toEqual([]);
    expect(pathModule.getRightPath()).toEqual(["right"]);
  });

  test("removeAllLastPath removes from both", () => {
    const pathModule = new PathModule();
    pathModule.addAllpath("a");
    pathModule.addAllpath("b");
    pathModule.removeAllLastPath();
    expect(pathModule.getLeftPath()).toEqual(["a"]);
    expect(pathModule.getRightPath()).toEqual(["a"]);
  });

  test("removeLastLeftPath removes only from left", () => {
    const pathModule = new PathModule();
    pathModule.addAllpath("a");
    pathModule.removeLastLeftPath();
    expect(pathModule.getLeftPath()).toEqual([]);
    expect(pathModule.getRightPath()).toEqual(["a"]);
  });

  test("removeLastRightPath removes only from right", () => {
    const pathModule = new PathModule();
    pathModule.addAllpath("a");
    pathModule.removeLastRightPath();
    expect(pathModule.getLeftPath()).toEqual(["a"]);
    expect(pathModule.getRightPath()).toEqual([]);
  });
});
