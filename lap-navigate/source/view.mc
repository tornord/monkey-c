import Toybox.Activity;
import Toybox.Lang;
import Toybox.Time;
import Toybox.WatchUi;

using Toybox.Math;

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

class View extends WatchUi.DataField {
  var appVer;

  var curAlt = 0.0;
  var lapAlt = null;

  var lapDist = null;
  var curDist = null;

  var lapTime = null;
  var curTime = null;

  var lapLoc = null;
  var curLoc = null;

  function initialize() {
    DataField.initialize();
    var appName = Application.loadResource(Rez.Strings.AppName);
    var i = appName.find("-v");
    appVer = appName.substring(i + 1, appName.length());
  }

  function compute(info as Activity.Info) {
    curAlt = info.altitude;
    curLoc = info.currentLocation;
    curDist = info.elapsedDistance;
    curTime = info.elapsedTime;
  }

  function onTimerLap() {
    var info = Activity.getActivityInfo();
    lapAlt = info.altitude;
    lapLoc = info.currentLocation;
    lapDist = info.elapsedDistance;
    lapTime = info.elapsedTime;
  }

  function onUpdate(dc) {
    var s0 = "";
    if (curAlt != null) {
      s0 = s0 + "A" + curAlt.format("%.0f");
    }
    if (lapAlt != null) {
      var d = curAlt - lapAlt;
      var ds = "+";
      if (d < 0) {
        ds = "";
      }
      s0 = s0 + " " + ds + d.format("%.0f");
    }
    if (lapDist != null && curDist != null) {
      var d = curDist - lapDist;
      if (curTime > lapTime) {
        var t = (curTime - lapTime) / 1000.0 / 60.0;
        var p = d / t;
        s0 = s0 + " P" + p.format("%.0f");
      }
    }
    var s1 = "";
    if (lapLoc != null && curLoc != null) {
      var loc1 = lapLoc.toDegrees() as [Double, Double];
      var lat1 = loc1[0];
      var lon1 = loc1[1];
      var loc2 = curLoc.toDegrees() as [Double, Double];
      var lat2 = loc2[0];
      var lon2 = loc2[1];
      if (lat1 != 0 && lon1 != 0 && lat2 != 0 && lon2 != 0) {
        var x = haversineFormula(lat1, lon1, lat1, lon2);
        var xh = "E";
        if (lon2 < lon1) {
          xh = "W";
        }
        var y = haversineFormula(lat1, lon1, lat2, lon1);
        var yh = "N";
        if (lat2 < lat1) {
          yh = "S";
        }
        s1 = s1 + " " + yh + y.format("%.0f") + " " + xh + x.format("%.0f");
      }
    }
    var bgColor = getBackgroundColor();
    var color = bgColor == Graphics.COLOR_BLACK ? Graphics.COLOR_WHITE : Graphics.COLOR_BLACK;
    dc.setColor(color, Graphics.COLOR_TRANSPARENT);
    var h = 0.3;
    var dh = 0.4;
    var font = Graphics.FONT_LARGE;
    dc.drawText(4, 2, Graphics.FONT_TINY, appVer, Graphics.TEXT_JUSTIFY_LEFT);
    dc.drawText(
      dc.getWidth() / 2,
      dc.getHeight() * h,
      font,
      s0,
      Graphics.TEXT_JUSTIFY_CENTER | Graphics.TEXT_JUSTIFY_VCENTER
    );
    dc.drawText(
      dc.getWidth() / 2,
      dc.getHeight() * (h + dh),
      font,
      s1,
      Graphics.TEXT_JUSTIFY_CENTER | Graphics.TEXT_JUSTIFY_VCENTER
    );
  }
}
