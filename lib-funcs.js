
var prefixes = ["18d6c7", "18a6f7", "8416f9", "c025e9"];

function shortennodeid(nodeid) {
  for (var i = 0; i < prefixes.length; i++) {
    if (nodeid.startsWith(prefixes[i])) {
      return nodeid.substr(prefixes[i].length);
    }
  }
  return nodeid;
}

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
