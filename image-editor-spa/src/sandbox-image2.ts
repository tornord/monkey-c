import Jimp from "jimp";

import { bicubicInterpolation } from "./bicubic-interpolation";
import { interpXY } from "./bilinear-interpolation";

// const gridDataW = [
//   [284, 29, 64, 24], // 0
//   [1656, 25, 69, 24], // 1
//   [3030, 27, 74, 24], // 2
//   [287, 1677, 64, 18], // 3
//   [1661, 1679, 69, 18], // 4
//   [3031, 1677, 74, 18], // 5
//   [281, 3334, 64, 12], // 6
//   [1661, 3372, 69, 12], // 7
//   [3040, 3336, 74, 12], // 8
// ];

const gridDataW = [
  [336, 472, 64, 24],
  [1740, 503.5, 69, 24],
  [3125.5, 538.5, 74, 24],
  [323, 2158, 64, 18],
  [1720, 2182, 69, 18],
  [3098, 2205, 74, 18],
  [302, 3840.5, 64, 12],
  [1699, 3854.5, 69, 12],
  [3075, 3867.5, 74, 12],
];

// const gridDataE = [
//   [142, 25, 75, 24], // 0
//   [420, 23, 76, 24], // 1
//   [698, 21, 77, 24], // 2
//   [153, 1696, 75, 18], // 3
//   [430, 1695, 76, 18], // 4
//   [706.5, 1694, 77, 18], // 5
//   [158, 3363, 75, 12], // 6
//   [436, 3361.5, 76, 12], // 7
//   [713, 3359, 77, 12], // 8
// ];

const gridDataE = [
  [145, 602, 75, 24],
  [430.5, 605, 76, 24],
  [713.5, 609, 77, 24],
  [142, 2298, 75, 18],
  [425, 2300.5, 76, 18],
  [706, 2303, 77, 18],
  [131.5, 3994, 75, 12],
  [414, 3993.5, 76, 12],
  [695.5, 3992, 77, 12],
];

function getGrid(x: number, y: number, gridData: number[][]) {
  const x1 = gridData[1][2];
  const y1 = gridData[3][3];
  const idxs = [0, 1, 3, 4];
  if (x <= x1) {
    if (y <= y1) return idxs.map((i) => gridData[i]);
    return idxs.map((i) => gridData[i + 3]);
  }
  if (y <= y1) return idxs.map((i) => gridData[i + 1]);
  return idxs.map((i) => gridData[i + 4]);
}

function checkCol(c: number) {
  if (c < 0) return 0;
  if (c > 255) return 255;
  return Math.round(c);
}

async function main() {
  const imageW = await Jimp.read("./public/GlenArtneyW2.jpg");
  const wW = imageW.bitmap.width;
  const hW = imageW.bitmap.height;
  const getValueFunW = (colIdx: number) => (ix: number, iy: number) => {
    if (ix < 0 || ix >= wW || iy < 0 || iy >= hW) {
      return 255;
    }
    const c = imageW.getPixelColor(ix, iy);
    const { r, g, b, a } = Jimp.intToRGBA(c);
    return [r, g, b, a][colIdx];
  };

  const imageE = await Jimp.read("./public/GlenArtneyE2.jpg");
  const wE = imageE.bitmap.width;
  const hE = imageE.bitmap.height;
  const getValueFunE = (colIdx: number) => (ix: number, iy: number) => {
    if (ix < 0 || ix >= wE || iy < 0 || iy >= hE) {
      return 255;
    }
    const c = imageE.getPixelColor(ix, iy);
    const { r, g, b, a } = Jimp.intToRGBA(c);
    return [r, g, b, a][colIdx];
  };

  const minX = 64;
  const maxX = 77;
  const minY = 24;
  const maxY = 11;
  const res = new Jimp(1500, 1500, 0xffffffff);
  for (let iy = 0; iy < res.bitmap.height; iy++) {
    for (let ix = 0; ix < res.bitmap.width; ix++) {
      const x = minX + (ix / res.bitmap.width) * (maxX - minX);
      const y = minY + (iy / res.bitmap.height) * (maxY - minY);
      const g = getGrid(x, y, x <= 74.824 ? gridDataW : gridDataE);
      const xx = (x - g[0][2]) / (g[1][2] - g[0][2]);
      const yy = (y - g[0][3]) / (g[2][3] - g[0][3]);
      const [x00, y00, x10, y10, x01, y01, x11, y11] = g.map((v) => [v[0], v[1]]).flat();
      const p = interpXY(xx, yy, x00, y00, x10, y10, x01, y01, x11, y11);
      const p0 = p.map((v) => Math.floor(v));
      const getValueFun = x <= 74.824 ? getValueFunW : getValueFunE;
      const colR = checkCol(bicubicInterpolation(p[0] - p0[0], p[1] - p0[1], p0[0], p0[1], getValueFun(0)));
      const colG = checkCol(bicubicInterpolation(p[0] - p0[0], p[1] - p0[1], p0[0], p0[1], getValueFun(1)));
      const colB = checkCol(bicubicInterpolation(p[0] - p0[0], p[1] - p0[1], p0[0], p0[1], getValueFun(2)));
      res.setPixelColor(Jimp.rgbaToInt(colR, colG, colB, 255), ix, iy);
    }
  }
  res.write("GlenArtney.jpg");
}

main();
