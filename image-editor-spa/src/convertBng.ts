import proj4 from "proj4";

const BNG =
  "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs towgs84='446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894'";

export function wgs84ToBng(lng: number, lat: number) {
  const p = proj4("WGS84", BNG, [lng, lat]);
  return p.map(Math.round);
}

export function bngToWgs84(easting: number, northing: number) {
  const p = proj4(BNG, "WGS84", [easting, northing]);
  return p;
}
