
# TODO

- @Daniel, jag undrar om det blir visuellt tydligare om alla nätuppkopplingar
  mot gateway är en egen nod i stället för att alla skall leda till samma
  knutpunkt? Om du orkar får du gärna prova :D

- kalle quite: En fet feature hade varit att måla vägen till GW via
  gateway_nexthop om man klicka en nod.
  - nexthop node_id visas nu iaf när man hovrar

- http://bl.ocks.org/1Cr18Ni9/f518e37f2c54d26364b8714b2154027c

https://github.com/mwarning/MeshNetSimulator

# misc

## gluon and MAC addresses

We found that the Wifianalyzer on Android reports a MAC/BSSID which seems to be
numerically 1 smaller than what is found in nodes.json. From #gluon:

    1042 <quite> Hm, we (pjodd.se) are getting confused by mac/bssid reported by
    android wifi-analyzer. It is one (1) less than what I find in
    mesh.bat0.interfaces.wireless of nodes.json . any clues?

    1105 <@neoraider> quite, mesh.bat0.interfaces.wireless is the address of the
    mesh0 interface (11s mode), your wifi analyzer shows the MAC address of client0
    (the AP interface in br-client) 110537 <@neoraider> quite, see
    http://gluon.readthedocs.io/en/v2017.1.x/dev/mac_addresses.html

wifianalyzer_MAC + 1 = wireless_mesh0_MAC

There is a tool for doing that, and finding the node_id (used for adding
descriptions in [lib-descs.js](lib-descs.js)): [tools/bssid-to-nodeid](tools/bssid-to-nodeid)

