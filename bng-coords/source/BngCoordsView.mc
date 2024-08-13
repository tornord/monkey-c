import Toybox.Activity;
import Toybox.Graphics;
import Toybox.Lang;
import Toybox.WatchUi;

using Toybox.Math;

const minLat = 56.2866;
const maxLat = 56.384;
const minLon = -4.2438;
const maxLon = -3.98055;
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

function interpXY(rs, x00, y00, x10, y10, x01, y01, x11, y11) {
  var r = rs[0];
  var s = rs[1];
  var x = x00 + (x10 - x00) * r + (x01 - x00) * s + (x00 - x10 - x01 + x11) * r * s;
  var y = y00 + (y10 - y00) * r + (y01 - y00) * s + (y00 - y10 - y01 + y11) * r * s;
  return [x, y];
}

function haversineFormula(lat1, lon1, lat2, lon2) {
  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  var dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d * 1000; // meters
}

class BngCoordsView extends WatchUi.DataField {
  var curLoc = null;

  function initialize() {
    DataField.initialize();
  }

  // Set your layout here. Anytime the size of obscurity of
  // the draw context is changed this will be called.
  function onLayout(dc as Dc) as Void {}

  // The given info object contains all the current workout information.
  // Calculate a value and save it locally in this method.
  // Note that compute() and onUpdate() are asynchronous, and there is no
  // guarantee that compute() will be called before onUpdate().
  function compute(info as Activity.Info) as Void {
    curLoc = info.currentLocation;
  }

  // Display the value you computed here. This will be called
  // once a second when the data field is visible.
  function onUpdate(dc as Dc) as Void {
    var s = ["", ""];
    if (curLoc != null) {
      var loc = curLoc.toDegrees() as [Double, Double];
      var lat = loc[0];
      var lng = loc[1];
      if (lat >= minLat && lat < maxLat && lng >= minLon && lng < maxLon) {
        var N = 4;
        var rd = (N * (lng - minLon)) / (maxLon - minLon);
        var ri = Math.floor(rd).toNumber();
        var sd = (N * (lat - minLat)) / (maxLat - minLat);
        var si = Math.floor(sd).toNumber();
        var p = interpXY(
          [rd - ri, sd - si],
          gridData[si][ri][2],
          gridData[si][ri][3],
          gridData[si][ri + 1][2],
          gridData[si][ri + 1][3],
          gridData[si + 1][ri][2],
          gridData[si + 1][ri][3],
          gridData[si + 1][ri + 1][2],
          gridData[si + 1][ri + 1][3]
        );
        s[0] = "E" + p[0].format("%.0f");
        s[1] = "N" + p[1].format("%.0f");
      }
    }
    var bgColor = getBackgroundColor();
    var color = bgColor == Graphics.COLOR_BLACK ? Graphics.COLOR_WHITE : Graphics.COLOR_BLACK;
    dc.setColor(color, Graphics.COLOR_TRANSPARENT);
    var h = 0.3;
    var dh = 0.4;
    var font = Graphics.FONT_LARGE;
    for (var i = 0; i < 2; i++) {
      dc.drawText(
        dc.getWidth() / 2,
        dc.getHeight() * (h + i * dh),
        font,
        s[i],
        Graphics.TEXT_JUSTIFY_CENTER | Graphics.TEXT_JUSTIFY_VCENTER
      );
    }
  }
}
