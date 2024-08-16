import { strict as assert } from "assert";

// (x01,y01) ----- r ------- (x11,y11)
//   |             |           |
//   s --------- (x,y) ------- s
//   |             |           |
//   |             |           |
//   |             |           |
//   |             |           |
// (x00,y00) ----- r ------- (x10,y10)

// const interp = (t, x0, x1) => x0 + t * (x1 - x0);
// const [r, s] = [1 / 3, 2 / 3];
// const [x00, x10, x01, x11] = [1, 10, -2, 4];
// const [y00, y10, y01, y11] = [2, 5, 8, 11];
// const xr0 = interp(r, x00, x10); // 4
// const yr0 = interp(r, y00, y10); // 3
// const xr1 = interp(r, x01, x11); // 0
// const yr1 = interp(r, y01, y11); // 9
// const xs0 = interp(s, x00, x01); // -1
// const ys0 = interp(s, y00, y01); // 6
// const xs1 = interp(s, x10, x11); // 6
// const ys1 = interp(s, y10, y11); // 9
// const x = interp(s, xr0, xr1); // 1.333333333333333
// const y = interp(s, yr0, yr1); // 7

export function interpXY(r, s, x00, y00, x10, y10, x01, y01, x11, y11) {
  const x = x00 + (x10 - x00) * r + (x01 - x00) * s + (x00 - x10 - x01 + x11) * r * s;
  const y = y00 + (y10 - y00) * r + (y01 - y00) * s + (y00 - y10 - y01 + y11) * r * s;
  return [x, y];
}

// const x = x00 + (x10 - x00) * r + (x01 - x00) * s + (x00 - x10 - x01 + x11) * r * s;
// const y = y00 + (y10 - y00) * r + (y01 - y00) * s + (y00 - y10 - y01 + y11) * r * s;
//
// (x - x00) - (x10 - x00) * r = ((x01 - x00) + (x00 - x10 - x01 + x11) * r) * s;
// (y - y00) - (y10 - y00) * r = ((y01 - y00) + (y00 - y10 - y01 + y11) * r) * s;
// s = ((x - x00) - (x10 - x00) * r) / ((x01 - x00) + (x00 - x10 - x01 + x11) * r);
// s = ((y - y00) - (y10 - y00) * r) / ((y01 - y00) + (y00 - y10 - y01 + y11) * r);
//
// a = x00 - x10 - x01 + x11
// b = y00 - y10 - y01 + y11;
// ((xx - x00) - (x10 - x00) * r) / ((x01 - x00) + (x00 - x10 - x01 + x11) * r) = ((yy - y00) - (y10 - y00) * r) / ((y01 - y00) + (y00 - y10 - y01 + y11) * r);
// ((xx - x00) - (x10 - x00) * r) * ((y01 - y00) + (y00 - y10 - y01 + y11) * r) = ((yy - y00) - (y10 - y00) * r) * ((x01 - x00) + (x00 - x10 - x01 + x11) * r);
//
// ((xx - x00) - (x10 - x00) * r) * ((y01 - y00) + b * r) = ((yy - y00) - (y10 - y00) * r) * ((x01 - x00) + a * r)
// -((x10 - x00) * b) * r * r + ((xx - x00) * b - (x10 - x00) * (y01 - y00)) * r + (xx - x00) * (y01 - y00) = -((y10 - y00) * a) * r * r + ((yy - y00) * a - (y10 - y00) * (x01 - x00)) * r + (yy - y00) * (x01 - x00)

export function interpRS(x, y, x00, y00, x10, y10, x01, y01, x11, y11) {
  const a = x00 - x10 - x01 + x11;
  const b = y00 - y10 - y01 + y11;
  const c = (y10 - y00) * a - (x10 - x00) * b;
  const d = (x - x00) * b - (x10 - x00) * (y01 - y00) - ((y - y00) * a - (y10 - y00) * (x01 - x00));
  const e = (x - x00) * (y01 - y00) - (y - y00) * (x01 - x00);
  let r;
  if (c === 0) {
    r = -e / d;
  } else {
    if (e === 0) {
      r = -d / c;
    } else {
      const f = Math.sqrt(d * d - 4 * c * e) / (2 * c);
      const r0 = -d / c / 2 + f;
      const r1 = -d / c / 2 - f;
      r = r0;
      if (Math.abs(r0 - 0.5) > Math.abs(r1 - 0.5)) {
        r = r1;
      }
    }
  }
  const fx = x01 - x00 + (x00 - x10 - x01 + x11) * r;
  const fy = y01 - y00 + (y00 - y10 - y01 + y11) * r;
  if (fx === 0 && fy === 0) return [r, 0];
  let s;
  if (fx === 0) {
    s = (y - y00 - (y10 - y00) * r) / fy;
  } else {
    s = (x - x00 - (x10 - x00) * r) / fx;
  }
  return [r, s];
}
