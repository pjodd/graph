#!/bin/bash
set -euo pipefail

BUILDDIR=${1}

HTML=(graph.html nodes.html)
ASSET=(index.html d3.min.js d3-queue.min.js p.png)
CSS=(graph.css)
JS=(graph.js nodes.js)
JSLIB=(lib-descs.js lib-funcs.js)

mkdir -p "$BUILDDIR"

cp -af "${HTML[@]}" "${CSS[@]}" "${ASSET[@]}" "$BUILDDIR"

for f in "${JS[@]}"; do
  cat "${JSLIB[@]}" "$f" | grep -v "^[[:space:]]*//" >"$BUILDDIR/$f"
done

cd "$BUILDDIR"
for f in "${CSS[@]}" "${JS[@]}"; do
  hash=$(md5sum <"$f" | cut -b 1-8)
  [[ -z "$hash" ]] && { echo "$f: hash: $hash"; exit 1; }
  hashedf="${f%.*},$hash.${f##*.}"
  cp -af "$f" "$hashedf"
  sed -i -E 's/(src|href)="'"$f"'"/\1="'"$hashedf"'"/' "${HTML[@]}"
  sed -i -E "$(printf 's/(src|href)="%s"/\1="%s"/' "$f" "$hashedf")" "${HTML[@]}"
done

exit 0
