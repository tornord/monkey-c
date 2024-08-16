import Jimp from "jimp";

import { interpRS, interpXY } from "./bilinear-interpolation";
import { bicubicInterpolation } from "./bicubic-interpolation";
import { bngToWgs84 } from "./convertBng";

// async function main() {
//   const w = 101;
//   const h = 101;
//   const image = await new Jimp(w, h, 0xffffffff);
//   for (let i = 0; i < w; i++) {
//     for (let j = 0; j < h; j++) {
//       if (i % 10 === 0 || j % 10 === 0) {
//         image.setPixelColor(0x000000ff, i, j);
//       }
//     }
//   }
//   // const image = await Jimp.read("image.jpg");
//   image.write("output.jpg");
// }

// Grid

const gridData = [
  [22.6, 7.8, 2, 2], // 0
  [57.6, 15.2, 5, 2], // 1
  [92.2, 22.6, 8, 2], // 2
  [15, 42.8, 2, 5], // 3
  [50, 50, 5, 5], // 4
  [84.6, 57.6, 8, 5], // 5
  [7.4, 77.6, 2, 8], // 6
  [42.2, 85.2, 5, 8], // 7
  [77.2, 92.4, 8, 8], // 8
];

function getGrid(x: number, y: number) {
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
  const image = await Jimp.read("./public/grid101x10_dist.png");
  const w = image.bitmap.width;
  const h = image.bitmap.height;
  const getValueFun = (colIdx: number) => (ix: number, iy: number) => {
    if (ix < 0 || ix >= w || iy < 0 || iy >= h) {
      return 255;
    }
    let c = image.getPixelColor(ix, iy);
    let { r, g, b, a } = Jimp.intToRGBA(c);
    return [r, g, b, a][colIdx];
  };

  const res = new Jimp(w, h, 0xffffffff);
  for (let iy = 0; iy < res.bitmap.height; iy++) {
    for (let ix = 0; ix < res.bitmap.width; ix++) {
      const x = ix / 10;
      const y = iy / 10;
      const g = getGrid(x, y);
      const xx = (x - g[0][2]) / (g[1][2] - g[0][2]);
      const yy = (y - g[0][3]) / (g[3][3] - g[0][3]);
      const [x00, y00, x10, y10, x01, y01, x11, y11] = g.map((v) => [v[0], v[1]]).flat();
      const p = interpXY(xx, yy, x00, y00, x10, y10, x01, y01, x11, y11);
      const p0 = p.map((v) => Math.floor(v));
      const colR = checkCol(bicubicInterpolation(p[0] - p0[0], p[1] - p0[1], p0[0], p0[1], getValueFun(0)));
      const colG = checkCol(bicubicInterpolation(p[0] - p0[0], p[1] - p0[1], p0[0], p0[1], getValueFun(1)));
      const colB = checkCol(bicubicInterpolation(p[0] - p0[0], p[1] - p0[1], p0[0], p0[1], getValueFun(2)));
      res.setPixelColor(Jimp.rgbaToInt(colR, colG, colB, 255), ix, iy);
    }
  }
  res.write("grid101x10_corr.jpg");
}

function calcHarveyMapsGlenArtney() {
  const g = [
    [61, 23, 25.5, 83],
    [77, 23, 1534, 36.5],
    [61, 12, 59.5, 1121],
    [77, 12, 1563.5, 1074.5],
  ];
  const p00 = interpRS(0, 0, ...g.map((v) => [v[2], v[3]]).flat());
  const r00 = interpXY(p00[0], p00[1], ...g.map((v) => [v[0], v[1]]).flat());
  const p11 = interpRS(1599, 1199, ...g.map((v) => [v[2], v[3]]).flat());
  const r11 = interpXY(p11[0], p11[1], ...g.map((v) => [v[0], v[1]]).flat());
  console.log(
    r00,
    r11,
    bngToWgs84(1000 * (200 + r00[0]), 1000 * (700 + r00[1])),
    bngToWgs84(1000 * (200 + r11[0]), 1000 * (700 + r11[1]))
  );
  // => [-4.256908010497348, 56.38668380845717]
  // => [-3.9823715395039954, 56.27260837500266]
}

calcHarveyMapsGlenArtney();
// main();
