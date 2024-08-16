using Toybox.Application;
using Toybox.Activity;
using Toybox.WatchUi;

class Map extends Application.AppBase {
  function initialize() {
    AppBase.initialize();
  }

  function getInitialView() {
    return [new DataField()];
  }
}

function getApp() {
    return Application.getApp();
}

class DataField extends WatchUi.DataField {
  function initialize() {
    DataField.initialize();
  }

  // <north>59.33012646630886</north>
  // <south>59.32355399303385</south>
  // <east>17.97124294088299</east>
  // <west>17.95837000707572</west>

  var minLat = 59.312440;
  var maxLat = 59.342562;
  var minLon = 17.911245;
  var maxLon = 17.987667;

  var imgs = 200;
  var rx = 8;
  var ry = 6;
  var tt = maxLat - minLat;
  var nn = maxLon - minLon;

  var x = null;
  var y = null;
  var ar = new [9];
  var pos = null;
  var mx = null;
  var my = null;

  function find(t, n) {
    var ayy = ((self.maxLat - t) / self.tt) * self.ry;
    var axx = ((n - self.minLon) / self.nn) * self.rx;

    if (ayy < 0 || ayy >= self.ry || axx < 0 || axx >= self.rx) {
      return false;
    }

    var yy = ayy.toNumber();
    var xx = axx.toNumber();

    self.my = (ayy - yy) * self.imgs;
    self.mx = (axx - xx) * self.imgs;

    var npos = yy * rx + xx;
    if (pos != npos) {
      var r = getMapArray();
      pos = npos;
      var i = 0;
      for (var iy = yy - 1; iy <= yy + 1; iy++) {
        for (var ix = xx - 1; ix <= xx + 1; ix++) {
          if (iy >= 0 && iy < ry && ix >= 0 && ix < rx) {
            ar[i] = Rez.Drawables[r[iy * rx + ix]];
          } else {
            ar[i] = null;
          }
          i += 1;
        }
      }
    }
    return true;
  }

  function onUpdate(dc) {
    var g = Activity.getActivityInfo().currentLocation;

    if (g != null) {
      g = g.toDegrees();
      if (find(g[0], g[1])) {
        var i = 0;
        for (var yy = y - imgs - my; yy < y + imgs; yy += imgs) {
          for (var xx = x - imgs - mx; xx < x + imgs; xx += imgs) {
            if (ar[i] != null) {
              dc.drawBitmap(xx, yy, WatchUi.loadResource(ar[i]));
            }
            i += 1;
          }
        }
      }
      g = null;
    }

    dc.setColor(0xff0000, -1);
    dc.fillRectangle(self.x - 2, self.y - 2, 4, 4);
  }

  function onLayout(dc) {
    self.x = dc.getWidth() / 2;
    self.y = dc.getHeight() / 2;
  }
}
