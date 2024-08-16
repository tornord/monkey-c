import { bngToWgs84, wgs84ToBng } from "./convertBng";

describe("convertBng", () => {
  it("WGS84 to BNG - 1", () => {
    const p = wgs84ToBng(-4.10344, 56.318507);
    expect(p).toEqual([270000, 716000]);
  });

  it("WGS84 to BNG - 2", () => {
    // https://www.google.se/maps/place/Comrie,+Crieff,+Storbritannien/@56.3401097,-4.0262814,139m/data=!3m1!1e3!4m6!3m5!1s0x48889037c429675b:0x3b8213b4473d01d4!8m2!3d56.377967!4d-3.995171!16zL20vMDZrcng0?entry=ttu
    const p = wgs84ToBng(-4.0262814, 56.3401097);
    expect(p).toEqual([274842, 718261]);
  });

  it("BNG to WGS84", () => {
    const p = bngToWgs84(270000, 716000);
    expect(p).toEqual([-4.103439730430583, 56.31850658121373]);
  });
});
