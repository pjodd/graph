
function prettyduration(millis) {
  var s = millis / 1000.0;
  var d = Math.floor(s / 86400);
  if (d) return d + "d";
  var h = Math.floor(s / 3600);
  if (h) return h + "h";
  var m = Math.floor(s / 60);
  if (m) return m + "m";
  return Math.floor(s) + "s";
}
