
// These are node_ids, as found in samples/graph.json
// (samples/graph_readable.json).

// If you've observed BSSID/MAC using for example Wifianalyser, you can use
// `tools/bssid-to-nodeid` to get hold of the node_id to be used here.

var descs = {
  "18d6c72a0cc4": "quite",

  "18a6f7f04a06": "möllan.moa",
  "18d6c7453ec4": "möllan.lulle",

  "18a6f7f04eae": "kalle.net",
  "18d6c72a100a": "kalle.sofiel", // mot fiskart
  "8416f92db85a": "sofiel.canyon",
  "8416f92daa8e": "fisk.beauty-r",
  "c025e9a84c8a": "fisk.cykelson",
  "c025e999ea9a": "fisk.istanbul",
  "c025e999e6ea": "fisk.thaithai2",
  "8416f92db72e": "thaibox",

  "8416f92daa22": "erik1",
  "18d6c72a0efe": "erik2",
  "8416f9e45668": "erik3",
  "8416f9aef416": "fredr",
  "8416f92db762": "fredr.torg",
  "18d6c72a0bc0": "fredr.fisk",
  "18d6c72a0eb6": "fredr.stat",
  "18d6c72a01e8": "haweli.fredr",
  "8416f92db8da": "haweli.möllan",
  "18d6c72a0ce6": "möllans.ost",

  "18d6c729ff4a": "daniel",
  "8416f92a6f18": "söfö.daniel",
  "18d6c74551f8": "söfö.lgh1201", // s förstadsg 80?
  "18d6c72a01c8": "supporterhuset",
  "18d6c72a08e0": "justnu",
  "8416f92db8a0": "ink-on-skin", //2e6f312f66f0
  "8416f92db832": "gorgeous",
  "18d6c72a0b30": "triangelnstobak", // s förstadsg 64
  "c025e99a14be": "mio", //66126cc0acf8
  "8416f9e39ae6": "triang.ammo",
  "18d6c72a0db0": "silwertobak", //8a750390e2e8
  "c025e9a84baa": "kökskomp", //b26d326008b0
  "18d6c729ff48": "triang.gabi1",
  "18d6c7453e5c": "triang.gabi2",
  "18a6f7f046c2": "gåg.pontus",
  "8416f92da9e6": "carlings",
  "8416f9ae6650": "triang.håkan",
  "18d6c72a0c6a": "triang.netnod",

  "18d6c72a1008": "kami",
  "18d6c72a0ecc": "zeo",
  "18d6c72a0a04": "zeo.nikolaig",
  "18d6c72a0196": "zeo.mölleg",
  "18d6c72a0bb0": "mölleg.chokladf",
  "18d6c729ff5a": "bergsg.chokladf",
  "c025e9a84b32": "bergsg.sara",
  "c025e999e70e": "mölleg.hojen",
  "c025e99a0e3a": "friisg.hojen",
  "c025e999e6e4": "mölleg.yukai",
};

function getnodedesc(nodeid) {
  if (!nodeid || !descs.hasOwnProperty(nodeid)) return "";
  return descs[nodeid];
}
