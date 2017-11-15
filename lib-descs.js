
// These are node_ids, as found in samples/graph.json
// (samples/graph_readable.json). If you're looking up MAC/BSSIDS using
// Wifianalyser, add 1 to the MAC (see README.md) and find this as "id" in
// graph.json to get hold of the node_id. Then stuff node_id along with
// description in here.

var descs = {
  "18d6c72a0cc4": "daniel",
  "18d6c7453ec4": "möllan.lulle",
  "18a6f7f04a06": "möllan.moa",
  "8416f92daa22": "erik1",
  "18d6c72a0efe": "erik2",
  "8416f9e45668": "erik3",
  "8416f9aef416": "fredr",
  "8416f92db762": "fredr.torg",
  "18d6c72a0bc0": "fredr.fisk",
  "18d6c72a0eb6": "fredr.stat",
  "8416f92db8da": "haweli?",
  "18a6f7f04eae": "kalle",
  "18d6c72a100a": "claesg.sofiel", // mot fiskart
  "c025e9a84c8a": "fisk.cykel",
  "c025e999e6e4": "fisk.istanb?",
  "18d6c72a0ecc": "martin.nets",
  "18d6c72a0a04": "martin.chok",
  "18d6c72a0196": "martin.akut",
  "18d6c72a1008": "kami",
  "8416f92a6f18": "söfö.danne",
  "18d6c72a08e0": "söfö.justnu", // ? black ink tattoo?
  "18d6c74551f8": "söfö.lgh1201",
  "18d6c729ff48": "triang.gabi1",
  "18d6c7453e5c": "triang.gabi2",
  "8416f9ae6650": "triang.håkan",
  "18a6f7f046c2": "pontus",
};

function getnodedesc(nodeid) {
  if (!nodeid || !descs.hasOwnProperty(nodeid)) return "";
  return descs[nodeid];
}
