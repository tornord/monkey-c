import { bicubicInterpolation } from "./bicubic-interpolation";

describe("bicubic-interpolation", () => {
  const data = [
    [1, 2, 4, 8], //y=-1
    [2, 4, 8, 16], //y=0
    [3, 6, 12, 24], //y=1
    [4, 8, 16, 32], //y=2
  ];

  const getValue = (ix: number, iy: number) => {
    if (ix < 0 || ix >= data[0].length || iy < 0 || iy >= data.length) {
      return 0;
    }
    return data[iy][ix];
  };

  it("should return correct values", () => {
    expect(bicubicInterpolation(0, 0, 1, 1, getValue)).toBeCloseTo(4);
    expect(bicubicInterpolation(1, 0, 1, 1, getValue)).toBeCloseTo(8);
    expect(bicubicInterpolation(0, 1, 1, 1, getValue)).toBeCloseTo(6);
    expect(bicubicInterpolation(1, 1, 1, 1, getValue)).toBeCloseTo(12);
  });

  it("should interpolate correctly", () => {
    expect(bicubicInterpolation(0.5, 0.5, 1, 1, getValue)).toBeCloseTo(7.03125);
    expect(bicubicInterpolation(0.9, 0, 1, 1, getValue)).toBeCloseTo(7.429);
    expect(bicubicInterpolation(0, 0.9, 1, 1, getValue)).toBeCloseTo(5.8);
    expect(bicubicInterpolation(0.9, 1, 1, 1, getValue)).toBeCloseTo(11.1435);
    expect(bicubicInterpolation(1, 0.9, 1, 1, getValue)).toBeCloseTo(11.6);
  });

  it("should interpolate correctly 2", () => {
    expect(bicubicInterpolation(-0.5, 0, 1, 1, getValue)).toBeCloseTo(2.375);
    expect(bicubicInterpolation(0, -0.5, 1, 1, getValue)).toBeCloseTo(3);
    expect(bicubicInterpolation(1.5, 1, 1, 1, getValue)).toBeCloseTo(17.8125);
    expect(bicubicInterpolation(1, 1.5, 1, 1, getValue)).toBeCloseTo(14);
  });

  it("should extrapolate correctly ", () => {
    expect(bicubicInterpolation(0, 0, 0, 0, getValue)).toBeCloseTo(1);
    expect(bicubicInterpolation(0, 1, 0, 0, getValue)).toBeCloseTo(2);
    expect(bicubicInterpolation(-0.5, -0.5, -1, -1, getValue)).toBeCloseTo(0);
  });
});
