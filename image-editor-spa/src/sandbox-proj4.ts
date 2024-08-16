import { strict as assert } from "assert";

import proj4 from "proj4";

// 270000 => -4.103440
// 716000 => 56.318507
// const y = proj4("EPSG:27700", "EPSG:4326", [270000, 716000]);

const bng =
  "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs towgs84='446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894'";

const x1 = proj4("WGS84", bng, [-4.10344, 56.318507]);
assert.deepEqual(
  x1.map((d) => Math.round(d)),
  [270000, 716000]
);

// https://www.google.se/maps/place/Comrie,+Crieff,+Storbritannien/@56.3401097,-4.0262814,139m/data=!3m1!1e3!4m6!3m5!1s0x48889037c429675b:0x3b8213b4473d01d4!8m2!3d56.377967!4d-3.995171!16zL20vMDZrcng0?entry=ttu

const x3 = proj4("WGS84", bng, [-4.0262814, 56.3401097]);
console.log(x3.map(Math.round));

let minLat = 56.2866;
let maxLat = 56.384;
let minLon = -4.2438;
let maxLon = -3.98055;

let N = 4;
let res = [];
for (let i = 0; i <= N; i++) {
  let row = [];
  for (let j = 0; j <= N; j++) {
    const x = minLon + ((maxLon - minLon) * j) / N;
    const y = minLat + ((maxLat - minLat) * i) / N;
    const p = proj4("WGS84", bng, [x, y]).map((d) => Math.round(d));
    row.push([x, y, p[0], p[1]]);
  }
  res.push(row);
}

console.log(JSON.stringify(res).replace(/0{3,}[1-9]+/g, ""));

const gridData = [
  [
    [-4.2438, 56.2866, 261205, 712724],
    [-4.1779875, 56.2866, 265278, 712593],
    [-4.112175, 56.2866, 269351, 712466],
    [-4.0463625, 56.2866, 273424, 712343],
    [-3.98055, 56.2866, 277497, 712224],
  ],
  [
    [-4.2438, 56.31095, 261293, 715433],
    [-4.1779875, 56.31095, 265363, 715303],
    [-4.112175, 56.31095, 269434, 715176],
    [-4.0463625, 56.31095, 273505, 715053],
    [-3.98055, 56.31095, 277575, 714934],
  ],
  [
    [-4.2438, 56.3353, 261381, 718143],
    [-4.1779875, 56.3353, 265449, 718012],
    [-4.112175, 56.3353, 269517, 717885],
    [-4.0463625, 56.3353, 273585, 717762],
    [-3.98055, 56.3353, 277653, 717643],
  ],
  [
    [-4.2438, 56.35965, 261470, 720852],
    [-4.1779875, 56.35965, 265535, 720722],
    [-4.112175, 56.35965, 269600, 720595],
    [-4.0463625, 56.35965, 273666, 720472],
    [-3.98055, 56.35965, 277731, 720353],
  ],
  [
    [-4.2438, 56.384, 261558, 723562],
    [-4.1779875, 56.384, 265621, 723431],
    [-4.112175, 56.384, 269684, 723305],
    [-4.0463625, 56.384, 273746, 723182],
    [-3.98055, 56.384, 277809, 723063],
  ],
];

function interpXY(r, s, x00, y00, x10, y10, x01, y01, x11, y11) {
  const x = x00 + (x10 - x00) * r + (x01 - x00) * s + (x00 - x10 - x01 + x11) * r * s;
  const y = y00 + (y10 - y00) * r + (y01 - y00) * s + (y00 - y10 - y01 + y11) * r * s;
  return [x, y];
}

const lat = 56.356851579621434;
const lng = -4.004152407869697;

const r = (N * (lng - minLon)) / (maxLon - minLon);
const ri = Math.floor(r);
const s = (N * (lat - minLat)) / (maxLat - minLat);
const si = Math.floor(s);
const x2 = interpXY(
  r - ri,
  s - si,
  gridData[si][ri][2],
  gridData[si][ri][3],
  gridData[si][ri + 1][2],
  gridData[si][ri + 1][3],
  gridData[si + 1][ri][2],
  gridData[si + 1][ri][3],
  gridData[si + 1][ri + 1][2],
  gridData[si + 1][ri + 1][3]
);
console.log(x2);
