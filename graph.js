// Not for now
// document.getElementById('prefixes').innerHTML = prefixes.join();

var q = d3.queue(2)
q.defer(d3.json, 'https://lublin.se/pjodd/gateway-01.mesh.pjodd.se/hopglass/nodes.json')
q.defer(d3.json, 'https://lublin.se/pjodd/gateway-01.mesh.pjodd.se/hopglass/graph.json')
q.await(function (err, nodesjson, graphjson) {
  if (err) {
    document.getElementById('sumnodes').innerHTML = 'FAIL?'
    document.getElementById('sumclients').innerHTML = 'FAIL?'
    return
  }
  main(nodesjson, graphjson)
})

function main (nodesjson, graphjson) {
  var allnodes = {}
  nodesjson.nodes.forEach(function (e, i, arr) {
    var thisnode = e.nodeinfo.node_id
    allnodes[thisnode] = e
    if (e.statistics.hasOwnProperty('gateway_nexthop')) {
      // we have nexthop mac, resolve to node_id and store in statistics
      var nextid = e.statistics.gateway_nexthop
      arr.forEach(function (e) {
        // The wireless interface's mac is the relevant one (`id` in graph.json) -- but
        // only when nexthop is over wifi! For nodes with an uplink, nextid will
        // be referring to the interfaces.tunnel (we anyway don't care about those
        // here).
        if (e.nodeinfo.network.mesh.bat0.interfaces.wireless === nextid) {
          allnodes[thisnode].statistics._nextnodeid = e.nodeinfo.node_id
        }
      })
    }
  })

  function getnodedata (nodeid, path) {
    if (!allnodes.hasOwnProperty(nodeid)) return null
    return getbypath(allnodes[nodeid], path)
  }

  document.getElementById('timestamp').innerHTML = graphjson.timestamp

  var w = 1100
  var h = 800

  var vis = d3.select('#chart')
      .append('svg:svg')
      .attr('viewBox', '0 0 ' + w + ' ' + h)

  var graph = graphjson.batadv
  document.getElementById('sumnodes').innerHTML = graph.nodes.length

  // add links between our gws (listed in descs)
  var gw01 = graph.nodes.findIndex(e => e.id == getByDesc('gw01'))
  var gw05 = graph.nodes.findIndex(e => e.id == getByDesc('gw05'))
  var gw06 = graph.nodes.findIndex(e => e.id == getByDesc('gw06'))
  if (gw01 > -1 && gw05  > -1) {
    graph.links.push({ source: gw01, target: gw05, type: "gws", tq: 1 })
  }
  if (gw05 > -1 && gw06  > -1) {
    graph.links.push({ source: gw05, target: gw06, type: "gws", tq: 1 })
  }
  if (gw01 > -1 && gw06  > -1) {
    graph.links.push({ source: gw01, target: gw06, type: "gws", tq: 1 })
  }

  var force = d3.layout.force()
      .gravity(0.017)
      .charge(-150)
      .linkDistance(50)
      .nodes(graph.nodes)
      .links(graph.links)
      .size([w, h])
      .start()

  var link = vis.selectAll('line.link')
      .data(graph.links)
      .enter().append('svg:line')
      .attr('class', function (d) { return 'link ' + d.type })
      .style('stroke-width', function (d) { return Math.sqrt(d.tq) })
      .attr('x1', function (d) { return d.source.x })
      .attr('y1', function (d) { return d.source.y })
      .attr('x2', function (d) { return d.target.x })
      .attr('y2', function (d) { return d.target.y })

  // hover over tlink
  link.append('svg:title')
    .text(function (d) {
      return 'TQ: ' + d.tq
    })

  var node = vis.selectAll('circle.node')
      .data(graph.nodes)
      .enter().append('svg:g')
      .attr('class', 'node')
      .call(force.drag)

  // TODO Hardcoded colors...
  var modelcolors = {
    'default': '#000000',
    'MR3020': '#3351e0',
    'WR841N': '#20a9e0',
    'Bullet M2': '#9966e0',
    'WR741N': '#d666e0',
    'WR1043N': '#20e0e0',
    'WBS210': '#4493e0'
  }
  node.append('svg:circle')
    .attr('r', 5)
    .style('fill', function (d) {
      // a gw? they have no node_id, and no nodeinfo
      if (!d.hasOwnProperty('node_id')) return
      var model = getnodedata(d.node_id, 'nodeinfo.hardware.model')
      if (model) {
        var c = modelcolors.default
        Object.keys(modelcolors).forEach(function (k) {
          if (model.indexOf(k) !== -1) {
            c = modelcolors[k]
          }
        })
        return c
      }
    })
  var models = ''
  Object.keys(modelcolors).forEach(function (k) {
    if (k !== 'default') {
      models += `<span style='color: ${modelcolors[k]};'>${k.toLowerCase()}</span> `
    }
  })
  document.getElementById('models').innerHTML = models

  node.append('text')
    .attr('dx', 10)
    .attr('dy', '.25em')
    .attr('class', function (d) {
      if (getdesc(d.node_id)) return 'desc'
    })
    .text(function (d) {
      var out = ''
      var id
      if (!d.hasOwnProperty('node_id')) {
        if (!d.hasOwnProperty('id')) return
        id = d.id
      } else {
        id = d.node_id
      }
      var text = id
      var desc = getdesc(id)
      if (desc) {
        text = desc
      }
      out += text
      // TODO
      // Same as online=false, right
      // if (d.hasOwnProperty('unseen')) {
      //     out += d.unseen
      // }
      return out
    })

  var sumclients = 0
  node.append('text')
    .attr('text-anchor', 'end')
    .attr('class', 'clients')
    .attr('dx', -10)
    .attr('dy', '.25em')
    .text(function (d) {
      if (!d.hasOwnProperty('node_id')) return
      var out = ''
      var clients = getnodedata(d.node_id, 'statistics.clients.total')
      if (clients) {
        out += clients
        sumclients += clients
      }
      return out
    })
  document.getElementById('sumclients').innerHTML = sumclients

  node.append('text')
    .attr('text-anchor', 'middle')
    .attr('class', 'offline')
    .attr('dx', 0)
    .attr('dy', '1.2em')
    .text(function (d) {
      if (!d.hasOwnProperty('node_id')) return
      var out = ''
      var online = getnodedata(d.node_id, 'flags.online')
      if (online !== null && !online) {
        out += 'offline '
        out += prettyduration(Date.now() - Date.parse(getnodedata(d.node_id, 'lastseen')))
      }
      return out
    })

  // hover
  node.append('svg:title')
    .text(function (d) {
      var out = ''
      if (d.hasOwnProperty('id')) {
        out += 'ID: ' + d.id
      }
      var nodeid = d.node_id
      if (nodeid) {
        out += '\nnode_id: ' + nodeid
        var val
        val = getnodedata(nodeid, 'statistics.gateway')
        if (val) {
          out += '\ngateway: ' + val
          val = getdesc(val) || '?'
          out += ' "' + val + '"'
        }
        val = getnodedata(nodeid, 'statistics.gateway_nexthop')
        if (val) {
          out += '\ngateway_nexthop: ' + val
        }
        val = getnodedata(nodeid, 'statistics._nextnodeid')
        if (val) {
          out += '\n    next node_id: ' + val
          out += ' "' + getdesc(val) + '"'
        }
        val = getnodedata(nodeid, 'nodeinfo.network.mesh.bat0.interfaces')
        if (val) {
          out += '\ninterface addresses:'
          Object.keys(val).forEach(function (iface) {
            out += '\n    ' + iface + ' ' + val[iface]
          })
        }
        val = getnodedata(nodeid, 'nodeinfo.network.addresses')
        if (val) {
          out += '\naddresses:\n    ' + val.join('\n    ')
        }
        val = getnodedata(nodeid, 'nodeinfo.hardware.model')
        if (val) {
          out += '\nmodel: ' + val
        }
        val = getnodedata(nodeid, 'nodeinfo.software.batman-adv.version')
        if (val) {
          out += '\nbat-version: ' + val
        }
        val = getnodedata(nodeid, 'nodeinfo.software.firmware.release')
        if (val) {
          out += '\nrelease: ' + val
        }
        val = getnodedata(nodeid, 'statistics.uptime')
        if (val) {
          out += '\nuptime: ' + prettyduration(val * 1000.0)
        }
      }
      return out
    })

  vis.style('opacity', 1e-6)
    .transition()
    .duration(1000)
    .style('opacity', 1)

  force.on('tick', function () {
    link.attr('x1', function (d) { return d.source.x })
      .attr('y1', function (d) { return d.source.y })
      .attr('x2', function (d) { return d.target.x })
      .attr('y2', function (d) { return d.target.y })
    node.attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })
  })
}
