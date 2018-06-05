
// The purpose of this is currently just to make the MAC addresses a bit more
// readable. There is no visibility anywhere of which vendor a shortened MAC
// belongs to. Therefor only shortening tp-links for now.
var prefixes = [
  // tp-link:
  "18a6f7",
  "18d6c7",
  "8416f9",
  "a0f3c1",
  "a42bb0",
  "c025e9",
  "f81a67",
];

function shortennodeid(nodeid) {
  // dont shorten for now
//  for (var i = 0; i < prefixes.length; i++) {
//    if (nodeid.startsWith(prefixes[i])) {
//      return nodeid.substr(prefixes[i].length);
//    }
//  }
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
