
// TODO, could keep nodesdata (values) in objs like these columns, rewrite the
// repr to eat vals directly, and so on... and let the sorting sort on repr if
// there is one, otherwise on val...

var q = d3.queue();
q.defer(d3.json, "http://gateway-01.mesh.pjodd.se/hopglass/nodes.json");
q.await(function(err, nodesjson) {
  if (err) throw(err);
  main(nodesjson);
});

function main(nodesjson) {
  var columns = {
    "node_id":         { path: "nodeinfo.node_id",
                         cssclass: "monospace center" },
    "desc":            { path: "nodeinfo.node_id",
                         repr: (f) => getdesc(f) },
    "uptime":          { path: "statistics.uptime",
                         cssclass: "right",
                         repr: (f) => prettyduration(f * 1000.0) },
    // "iface-tunnel": { path: "nodeinfo.network.mesh.bat0.interfaces.tunnel" },
    "online":          { path: "flags.online",
                         cssclass: "center" },
    "uplink":          { path: "flags.uplink",
                         cssclass: "center" },
    // "gateway": { path: "statistics.gateway" },
    "iface-wireless":  { path: "nodeinfo.network.mesh.bat0.interfaces.wireless",
                         cssclass: "monospace center",
                         repr: (f) => f.replace(/:/g, "") },
    "gateway_nexthop": { path: "statistics.gateway_nexthop",
                         cssclass: "monospace center",
                         repr: (f) => f.replace(/:/g, "") },
    "lastseen":        { path: "lastseen",
                         cssclass: "right",
                         repr: (f) => prettyduration(Date.now() - Date.parse(f)) },
    "firstseen":       { path: "firstseen",
                         cssclass: "right",
                         repr: (f) => prettyduration(Date.now() - Date.parse(f)) },
    "clients":         { path: "statistics.clients",
                         cssclass: "right" },
    "loadavg":         { path: "statistics.loadavg",
                         cssclass: "center",
                         repr: (f) => f.toFixed(2) },
    "memuse":          { path: "statistics.memory_usage",
                         cssclass: "center",
                         repr: (f) => f.toFixed(2) },
    "model":           { path: "nodeinfo.hardware.model",
                         repr: (f) => f.replace(/^TP-Link TL-/, "").toLowerCase() },
    "release":         { path: "nodeinfo.software.firmware.release" },
    "bat-version":     { path: "nodeinfo.software.batman-adv.version" },
    "addrs (non-fe80)":{ path: "nodeinfo.network.addresses",
                         repr: (f) => f.filter(addr => !addr.startsWith("fe80:")).join(" ")},
  }

  var nodes = nodesjson.nodes.map(function (node) {
    var nodeobj = {};
    Object.keys(columns).forEach(function (column) {
      val = getbypath(node, columns[column].path);
      // it's actually an array
      if (val && column == "iface-wireless") {
        val = val[0];
      }
      nodeobj[column] = val;
    });
    return nodeobj;
  });

  var sortable = function (nodes) {
    var table = document.createElement("table");
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var sortorders = {};

    thead.addEventListener("click", function (ev) {
      var ordercol = ev.target.dataset.key;
      sortorders[ordercol] = !sortorders[ordercol];
      draw(nodes, ordercol);
    });

    function draw(nodes, ordercol) {
      var d = sortorders[ordercol] ? -1 : 1;
      nodes = nodes.sort(function (a, b) {
        return a[ordercol] < b[ordercol] ? d : d * -1;
      });

      thead.innerHTML = "";
      var tr = thead.insertRow();
      Object.keys(nodes[0]).forEach(function (column) {
        var th = document.createElement("th");
        th.setAttribute("title", columns[column].path);
        tr.appendChild(th);
        var sortprefix = "";
        if (ordercol == column) {
          sortprefix = "^ "
          if (sortorders[ordercol]) {
            sortprefix = "v ";
          }
        }
        th.appendChild(document.createTextNode(sortprefix + column));
        th.setAttribute("data-key", column);
      });

      tbody.innerHTML = "";
      var now = Date.now();
      nodes.forEach(function (nodeobj) {
        var tr = tbody.insertRow();
        Object.keys(nodeobj).forEach(function (column) {
          var td = tr.insertCell();
          var field = nodeobj[column];
          td.setAttribute("title", field);
          var repr = columns[column].repr
          if (field && repr) {
            field = repr(field);
          }
          td.appendChild(document.createTextNode(field));
          var cssclass = columns[column].cssclass
          if (cssclass) {
            td.setAttribute("class", cssclass);
          }
        });
      });
    }

    draw(nodes, "lastseen");

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
  }

  document.getElementById("table").appendChild(sortable(nodes));
}
