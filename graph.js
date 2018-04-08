
"use strict";

// Not for now
// document.getElementById("prefixes").innerHTML = prefixes.join();

var req;

var allnodes = {};
req = new XMLHttpRequest();
req.open("GET", "http://gateway-01.mesh.pjodd.se/hopglass/nodes.json", false);
req.send();
var nodesjson = JSON.parse(req.responseText);
nodesjson.nodes.forEach(function (e, i, arr) {
  var thisnode = e.nodeinfo.node_id;
  allnodes[thisnode] = e;
  if (e.statistics.hasOwnProperty("gateway_nexthop")) {
    // we have nexthop mac, resolve to node_id and store in statistics
    var nextid = e.statistics.gateway_nexthop;
    arr.forEach(function (e) {
      // The wireless interface's mac is the relevant one (`id` in graph.json) -- but
      // only when nexthop is over wifi! For nodes with an uplink, nextid will
      // be referring to the interfaces.tunnel (we anyway don't care about those
      // here).
      if (e.nodeinfo.network.mesh.bat0.interfaces.wireless == nextid) {
        allnodes[thisnode].statistics._nextnodeid = e.nodeinfo.node_id;
      }
    });
  }
});

var graphjson;
req = new XMLHttpRequest();
req.open("GET", "http://gateway-01.mesh.pjodd.se/hopglass/graph.json", false);
req.send();
graphjson = JSON.parse(req.responseText);

document.getElementById("timestamp").innerHTML = graphjson.timestamp;

var w = 1100, h = 800;

var vis = d3.select("#chart")
  .append("svg:svg")
  .attr("viewBox", "0 0 " + w + " " + h);

var graph = graphjson.batadv;
document.getElementById("sumnodes").innerHTML = graph.nodes.length;

var force = d3.layout.force()
  .gravity(0.02)
  .charge(-110)
  .linkDistance(70)
  .nodes(graph.nodes)
  .links(graph.links)
  .size([w, h])
  .start();

var link = vis.selectAll("line.link")
  .data(graph.links)
  .enter().append("svg:line")
  .attr("class", function (d) { return "link " + d.type; })
  .style("stroke-width", function (d) { return Math.sqrt(d.tq); })
  .attr("x1", function (d) { return d.source.x; })
  .attr("y1", function (d) { return d.source.y; })
  .attr("x2", function (d) { return d.target.x; })
  .attr("y2", function (d) { return d.target.y; });

//hover
link.append("svg:title")
  .text(function (d) {
    return "TQ: " + d.tq;
  });

var node = vis.selectAll("circle.node")
  .data(graph.nodes)
  .enter().append("svg:g")
  .attr("class", "node")
  .call(force.drag);

// TODO Hardcoded colors...
var modelcolors = {
  "default": "#000000",
  "MR3020": "#3351e0",
  "WR841N": "#20a9e0",
}
node.append("svg:circle")
  .attr("r", 5)
  .style("fill", function (d) {
    // a gw? they have no node_id, and no nodeinfo
    if (!d.hasOwnProperty("node_id")) return;
    var val = getnodeinfokey(d.node_id, "hardware");
    if (val) {
      var c = modelcolors.default;
      Object.keys(modelcolors).forEach(function(k) {
        if (val.model.indexOf(k) != -1) {
          c = modelcolors[k];
        }
      });
      return c;
    }
  });
var models = "";
Object.keys(modelcolors).forEach(function(k) {
  if (k != "default") {
    models += `<span style="color: ${modelcolors[k]};">${k.toLowerCase()}</span> `;
  }
});
document.getElementById("models").innerHTML = models;

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

// TODO could prob replace these with some path-getter, like in nodes.js
function getstatskey(nodeid, which) {
  var stats = getkey(nodeid, "statistics");
  if (!stats || !stats.hasOwnProperty(which)) return null;
  return stats[which];
}

function getflagskey(nodeid, which) {
  var flags = getkey(nodeid, "flags");
  if (!flags || !flags.hasOwnProperty(which)) return null;
  return flags[which];
}

function getnodeinfokey(nodeid, which) {
  var ni = getkey(nodeid, "nodeinfo");
  if (!ni || !ni.hasOwnProperty(which)) return null;
  return ni[which];
}

function getkey(nodeid, which) {
  if (!allnodes.hasOwnProperty(nodeid)) return null;
  var n = allnodes[nodeid];
  if (!n.hasOwnProperty(which)) return null;
  return n[which];
}

node.append("text")
  .attr("dx", 10)
  .attr("dy", ".25em")
  .attr("class", function (d) {
    if (getdesc(d.node_id))
        return "desc";
  })
  .text(function (d) {
    var out = "";
    var id;
    if (!d.hasOwnProperty("node_id")) {
      if (!d.hasOwnProperty("id")) return;
      id = d.id;
    } else {
      id = d.node_id;
    }
    var text = shortennodeid(id);
    var desc = getdesc(id);
    if (desc) {
      text = desc;
    }
    out += text;
    // TODO
    // Same as online=false, right
    // if (d.hasOwnProperty("unseen")) {
    //     out += d.unseen;
    // }
    return out;
  });

var sumclients = 0;
node.append("text")
  .attr("text-anchor", "end")
  .attr("class", "clients")
  .attr("dx", -10)
  .attr("dy", ".25em")
  .text(function (d) {
    if (!d.hasOwnProperty("node_id")) return;
    var out = "";
    var clients = getstatskey(d.node_id, "clients");
    if (clients) {
      out += clients;
      sumclients += clients;
    }
    return out;
  });
document.getElementById("sumclients").innerHTML = sumclients;

node.append("text")
  .attr("text-anchor", "middle")
  .attr("class", "offline")
  .attr("dx", 0)
  .attr("dy", "1.2em")
  .text(function (d) {
    if (!d.hasOwnProperty("node_id")) return;
    var out = "";
    var online = getflagskey(d.node_id, "online");
    if (online != null && !online) {
      out += "offline ";
      out += prettyduration(Date.now() - Date.parse(getkey(d.node_id, "lastseen")));
    }
    return out;
  });

// hover
node.append("svg:title")
  .text(function (d) {
    var out = "";
    if (d.hasOwnProperty("id")) {
      out += "ID: " + d.id;
    }
    var nodeid = d.node_id;
    if (nodeid) {
      out += "\nnode_id: " + nodeid;
      var val;
      val = getstatskey(nodeid, "gateway");
      if (val) {
        out += "\ngateway: " + val;
      }
      val = getstatskey(nodeid, "gateway_nexthop");
      if (val) {
        out += "\ngateway_nexthop: " + val;
      }
      val = getstatskey(nodeid, "_nextnodeid");
      if (val) {
        out += "\n    next node_id: " + shortennodeid(val);
        out += " '" + getdesc(val) + "'";
      }
      val = getnodeinfokey(nodeid, "network");
      if (val) {
        var ifaces = val.mesh.bat0.interfaces;
        out += "\ninterface addresses:";
        Object.keys(ifaces).forEach(function (iface) {
          out += "\n    " + iface + " " + ifaces[iface];
        });
        out += "\naddresses:\n    " + val.addresses.join("\n    ");
      }
      val = getnodeinfokey(nodeid, "hardware");
      if (val) {
        out += "\nmodel: " + val.model;
      }
      val = getstatskey(nodeid, "uptime");
      if (val) {
        out += "\nuptime: " + prettyduration(val * 1000.0);
      }
    }
    return out;
  });

vis.style("opacity", 1e-6)
  .transition()
  .duration(1000)
  .style("opacity", 1);

force.on("tick", function () {
  link.attr("x1", function (d) { return d.source.x; })
    .attr("y1", function (d) { return d.source.y; })
    .attr("x2", function (d) { return d.target.x; })
    .attr("y2", function (d) { return d.target.y; });
  node.attr("transform", function (d) {
    return "translate(" + d.x + "," + d.y + ")";
  });
});
