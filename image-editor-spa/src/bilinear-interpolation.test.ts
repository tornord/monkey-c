import { interpRS, interpXY } from "./bilinear-interpolation";

describe("bilinear-interpolation", () => {
  it("base case, quad", () => {
    const [r, s] = [1 / 3, 2 / 3];
    const [x00, x10, x01, x11] = [1, 10, -2, 4];
    const [y00, y10, y01, y11] = [2, 5, 8, 11];
    const [x, y] = interpXY(r, s, x00, y00, x10, y10, x01, y01, x11, y11);
    const [r2, s2] = interpRS(x, y, x00, y00, x10, y10, x01, y01, x11, y11);
    expect([x, y, r2, s2]).toEqual([1.3333333333333335, 7, 0.3333333333333335, 0.666666666666667]);
  });

  it("triangle (x00, y00) = (x01, y01)", () => {
    const [r, s] = [1 / 3, 2 / 3];
    const [x00, x10, x01, x11] = [2, 14, 2, 5];
    const [y00, y10, y01, y11] = [1, 4, 1, 10];
    const [x, y] = interpXY(r, s, x00, y00, x10, y10, x01, y01, x11, y11);
    const [r2, s2] = interpRS(x, y, x00, y00, x10, y10, x01, y01, x11, y11);
    expect([x, y, r2, s2]).toEqual([4, 3.333333333333333, 0.3333333333333333, 0.6666666666666666]);
  });

  it("triangle (x00, y00) = (x10, y10)", () => {
    const [r, s] = [1 / 3, 1 / 3];
    const [x00, x10, x01, x11] = [2, 2, 5, 14];
    const [y00, y10, y01, y11] = [1, 1, 10, 4];
    const [x, y] = interpXY(r, s, x00, y00, x10, y10, x01, y01, x11, y11);
    const [r2, s2] = interpRS(x, y, x00, y00, x10, y10, x01, y01, x11, y11);
    expect([x, y, r2, s2]).toEqual([4, 3.3333333333333335, 0.3333333333333333, 0.3333333333333333]);
  });

  it("triangle (x00, y00) = (x10, y10) and r = 0, s can be any number", () => {
    const [r, s] = [0, 37];
    const [x00, x10, x01, x11] = [2, 14, 2, 5];
    const [y00, y10, y01, y11] = [1, 4, 1, 10];
    const [x, y] = interpXY(r, s, x00, y00, x10, y10, x01, y01, x11, y11);
    const [r2, s2] = interpRS(x, y, x00, y00, x10, y10, x01, y01, x11, y11);
    expect([x, y, r2, s2]).toEqual([2, 1, 0, 0]);
  });

  it("triangle (x00, y00) = (x10, y10) and r = 1", () => {
    const [r, s] = [1, 2 / 3];
    const [x00, x10, x01, x11] = [2, 14, 2, 5];
    const [y00, y10, y01, y11] = [1, 4, 1, 10];
    const [x, y] = interpXY(r, s, x00, y00, x10, y10, x01, y01, x11, y11);
    const [r2, s2] = interpRS(x, y, x00, y00, x10, y10, x01, y01, x11, y11);
    expect([x, y, r2, s2]).toEqual([8, 8, 1, 0.6666666666666666]);
  });

  it("triangle (x00, y00) = (x10, y10) and s = 1", () => {
    const [r, s] = [1 / 3, 1];
    const [x00, x10, x01, x11] = [2, 14, 2, 5];
    const [y00, y10, y01, y11] = [1, 4, 1, 10];
    const [x, y] = interpXY(r, s, x00, y00, x10, y10, x01, y01, x11, y11);
    const [r2, s2] = interpRS(x, y, x00, y00, x10, y10, x01, y01, x11, y11);
    expect([x, y, r2, s2]).toEqual([3, 4, 0.3333333333333333, 1]);
  });

  it("quad extrapolation", () => {
    const [r, s] = [-0.25, -0.5];
    const [x00, x10, x01, x11] = [1, 5, 1, 5];
    const [y00, y10, y01, y11] = [1, 1, 3, 3];
    const [x, y] = interpXY(r, s, x00, y00, x10, y10, x01, y01, x11, y11);
    const [r2, s2] = interpRS(x, y, x00, y00, x10, y10, x01, y01, x11, y11);
    expect([x, y, r2, s2]).toEqual([0, 0, -0.25, -0.5]);
  });
});
