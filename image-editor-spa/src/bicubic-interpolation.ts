function terp(t: number, arr: number[]) {
  const [a, b, c, d] = arr;
  return 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * t) * t) * t + b;
}

export function bicubicInterpolation(
  x: number,
  y: number,
  ix: number,
  iy: number,
  getValue: (_ix: number, _iy: number) => number
) {
  const idxs = [-1, 0, 1, 2];
  const ys = idxs.map((dy) =>
    terp(
      x,
      idxs.map((dx) => getValue(ix + dx, iy + dy))
    )
  );
  return terp(y, ys);
}
