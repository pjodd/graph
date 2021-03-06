'use strict'

// These are node_ids, as found in samples/graph.json
// (samples/graph_readable.json).

// If you've observed BSSID/MAC using for example Wifianalyser, you can use
// `tools/bssid-to-nodeid` to get hold of the node_id to be used here.

var descs = {
  '00:91:0d:d0:5e:01': 'gw01',
  '00:91:0d:d0:5e:05': 'gw05',
  '00:91:0d:d0:5e:06': 'gw06',

  '18d6c72a0cc4': 'quite',

  'a42bb0b426ec': 'mölletrg.nö',
  
  'a0f3c1c4529a': 'mölletrg.sö.0',
  '8416f9e4546e': 'mölletrg.sö.1',
  '18d6c72a100a': 'mölletrg.sö.ute',

  '18a6f7f04a06': 'i11.mölletrg.sö',
  '18a6f7f04eae': 'i11.mölletrg.sö.bounce',
  'a0f3c19699d6': 'i11.mölletrg.sö.net',

  'a0f3c19695b0': 'fd.kalle.slg',
  'a0f3c18242c4': 'fd.kalle.ig',

  '18d6c7453ec4': 'leonard0', // elvis
  'a0f3c1968c86': 'leonard1', // elvis
  'a0f3c19688fa': 'leonard2', // elvis
  'a0f3c1969972': 'leonard3',
  '18a6f7af71d4': 'leonard4',
  '18d6c729ff4a': 'leonard5',

  '8416f92db85a': 'sofiel.canyon',
  '8416f92daa8e': 'fisk.beauty-r',
  'c025e9a84c8a': 'fisk.cykelson',
  'c025e999ea9a': 'fisk.istanbul',
  '8416f92da9a8': 'fisk.thaithai_torg',
  'c025e999e6ea': 'fisk.thaithai2',
  '8416f92db72e': 'thaibox',

  '8416f92daa22': 'erik1',
  '18d6c72a0efe': 'erik2',
  '8416f9e45668': 'erik3',
  '802aa8c55d3a': 'hemlikt.uplnk',
  '8416f92db762': 'hemlikt.mtorg',
  '18d6c72a0bc0': 'hemlikt.ftorg',
  '18d6c72a0eb6': 'hemlikt.trist',
  '18d6c72a0bba': 'smthn.möllan',
  '18d6c72a01e8': 'haweli.smthn',
  '8416f92db8da': 'haweli.möllan',
  '18d6c72a0ce6': 'möllans.ost',

  '8416f92db6d8': 'söfö.d.triangeln',
  'a0f3c182502e': 'söfö.d.net',
  '18d6c72a0c28': 'söfö.d.möllan',
  '8416f92a6f18': 'söfö.d.innergård',
  '18d6c72a01c8': 'supporterhuset',
  '18d6c72a08e0': 'justnu',
  '8416f92db8a0': 'ink-on-skin', // 2e6f312f66f0
  '8416f92db832': 'gorgeous',
  '18d6c72a0b30': 'triangelnstobak', // s förstadsg 64
  'c025e99a14be': 'mio', // 66126cc0acf8
  '8416f9e39ae6': 'triang.ammo',
  '18d6c72a0db0': 'silwertobak', // 8a750390e2e8
  'c025e9a84baa': 'kökskomp', // b26d326008b0
  '18d6c729ff48': 'triangtrg.g1',
  '18d6c7453e5c': 'triangtrg.g2',
  '18a6f7f046c2': 'triangtrg.g3',
  '8416f92dbdea': 'p.söfö',
  '18d6c72a01d6': 'p.rådmansg',
  '8416f92db798': 'p.gåg',
  '8416f92da9e6': 'carlings',
  'a0f3c1824c36': 'soffor&sängar',
  '8416f9ae6650': 'tritrg.h',
  'a0f3c1824c40': 'tritrg.netnod',
  '18d6c72a1008': 'k.kapellgatan',
  '8416f9ae65f0': 'k.kapellplan',

  '704f5783b2ea': 'zeo',
  '00156deeeb3c': 'zeo.nikolaig',
  '18d6c72a0a04': 'nikolaig',
  '18d6c72a0ecc': 'zeo.mölleg',
  '18d6c72a0bb0': 'mölleg.chokladf',
  '18d6c729ff5a': 'bergsg.chokladf',
  'c025e9a84b32': 'bergsg.sara',
  'c025e999e70e': 'mölleg.hojen',
  'a0f3c1969512': 'möllevg.r',
  'c025e99a0e3a': 'söskolg.hojen',
  'c025e999e6e4': 'bergsg.yukai',
  'e894f60ca8f8': 'mölleg.yukai',
  '18d6c72a0c30': 'kristianstadsg.minisweetlivs',
  '8416f92db79e': 'utklippan-s', // fredriks polare johan
  '18d6c72a0196': 'utklippan-n',
  '18a6f7f04c8a': 'buenos.aires.72',
  '18d6c72a109a': 'intergrill',
  '18a6f7f05052': 'curryhut.kristianstadsg',
  'f81a678c725c': 'rotana',

  '6466b3c524d6': 'lodet.n',
  'a0f3c1824c5a': 'lodet.m',
  '8416f9aebd56': 'lodet.s',

  'a0f3c19699ac': 'mne-1',
  'a0f3c19699d2': 'mne-2',
  'a0f3c1821f44': 'mne-3',

  '18a6f7f03e4a': 'fp.rondellen.j-1',
  '8416f92db8b2': 'fp.rondellen.j-2',

  'a0f3c1969994': 'prosper.solvesborg.net',
  'a0f3c1824ada': 'prosper.solvesborg.out',

  '6466b3c53d82': 'floyd',
  'a0f3c1824b38': 'wombat',

  'a0f3c19698ce': 'damary',
  '18d6c72a0c6a': 'jesusbaren.uplnk',
  'a0f3c1824a98': 'jesusbaren',

  '18a6f790f936': 'kristianstadsg.ost',
  '8416f9ae9df8': 'kristianstadsg.c', // martins polares granne
  'a0f3c1969988': 'amalthea.kg',
  'a0f3c1823ec2': 'amalthea.nv',

  'a0f3c182517a': 'sege.dixie.1',
  'a0f3c1823ce2': 'sege.dixie.2',
  'a0f3c18250f2': 'sege.dixie.3',

  '18d6c72a0b74': 'clæsgatan',
  'a0f3c19698c6': 'knasgatan',

  '18d6c72a125e': '5hUr1k3n',

  'a0f3c1824b56': 'ö.farmv',
  'a0f3c1824b8c': 'ö.farmv->kiviksg',

  'a0f3c1969964': 'smedjeg.5.fm',

  'a0f3c19699be': 'viking',

  '8416f9e45a90': 'mm.studio', //?
  'a0f3c19697fc': 'mm.1',
  'a0f3c19699c8': 'mm.2', //foodc?
  'a0f3c196982c': 'mm.3', //br?

  'a0f3c1824c84': 'teknikerg.uppl',
  'a0f3c1824c78': 'teknikerg',
  
  '18a6f7f0528a': 'pjodderick',

  '': 'sentinel'
}

function getdesc (id) {
  if (!id || !descs.hasOwnProperty(id)) return ''
  return descs[id]
}

function getByDesc (desc) {
  return Object.keys(descs).find(id => descs[id] === desc) || ''
}
