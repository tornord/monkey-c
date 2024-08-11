using Toybox.Application;
using Toybox.Activity;
using Toybox.WatchUi;

class Map extends Application.AppBase {
  function getInitialView() {
    return [new DataField()];
  }
}

class DataField extends WatchUi.DataField {
  function initialize() {
    DataField.initialize();
  }

  // <north>59.33012646630886</north>
  // <south>59.32355399303385</south>
  // <east>17.97124294088299</east>
  // <west>17.95837000707572</west>

  var minLat = 56.28660;
  var maxLat = 56.38400;
  var minLon = -4.24380;
  var maxLon = -3.98055;

  var imgs = 256;
  var rx = 6;
  var ry = 4;
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
      // var r = [ :m0, :m1, :m2, :m3, :m4, :m5, :m6, :m7,
      //           :m8, :m9,:m10,:m11,:m12,:m13,:m14,:m15,
      //           :m16,:m17,:m18,:m19,:m20,:m21,:m22,:m23,
      //           :m24,:m25,:m26,:m27,:m28,:m29,:m30,:m31,
      //           :m32,:m33,:m34,:m35,:m36,:m37,:m38,:m39,
      //           :m40,:m41,:m42,:m43,:m44,:m45,:m46,:m47,
      //           :m48,:m49,:m50,:m51,:m52,:m53,:m54,:m55,
      //           :m56,:m57,:m58,:m59,:m60,:m61,:m62,:m63];
      var r = [
        :m0,
        :m1,
        :m2,
        :m3,
        :m4,
        :m5,
        :m6,
        :m7,
        :m8,
        :m9,
        :m10,
        :m11,
        :m12,
        :m13,
        :m14,
        :m15,
        :m16,
        :m17,
        :m18,
        :m19,
        :m20,
        :m21,
        :m22,
        :m23,
      ];

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
