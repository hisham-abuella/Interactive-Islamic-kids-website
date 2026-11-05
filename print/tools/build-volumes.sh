#!/usr/bin/env bash
# Build the bound volumes for Lulu, then check them.
#
#   print/tools/build-volumes.sh [--draft] [--long] [<vol-slug>...]
#
# --long is the template's tier for pages written long (40-70 words a side): a
# smaller picture so type stays at 14pt+/15pt+. Use it only if
# check-print-text.py reports clipping without it.
#
# Ported from ~/Work/bedtime-stories/tools/build-volumes.sh. A single story or
# surah is 7-15 pages: below every binding Lulu offers except staples. Bound as
# volumes they clear the 32-page perfect-bound minimum (and the 24-page
# hardcover one), so they can be a real hardcover. The grouping lives in
# tools/volumes.json (shared with check-qr.py); it is a proposal for the owner.
#
# Each volume gets a cover of its own that lists what is inside in both
# languages, with a shelf/hub QR; every book keeps its own cover page inside
# as a section divider with its own per-page QR.
#
# --draft: build from the 960px web plates (stamped DRAFT) into draft/, for
# layout review only. Without it, every plate needs a print master.
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE="https://hisham-abuella.github.io/Interactive-Islamic-kids-website/UI"
draft=0 want=() extra=()
for a in "$@"; do case $a in --draft) draft=1 ;; --long) extra+=(--long) ;; *) want+=("$a") ;; esac; done
art=hi dest=. sfx=''
(( draft )) && { art=draft dest=draft sfx=-draft; }
mkdir -p build books "$dest"
[[ -f input/qr/qr-shelf.svg ]] || uvx --with segno python tools/make-qr.py >/dev/null

# Re-extract EVERY book in volumes.json from its page, not only the volumes
# being built: the scripture check below reads all of them, and an extraction
# older than its page would check stale words (QA 2026-11-04).
for b in $(python3 -c "import json; print(' '.join(b for v in json.load(open('tools/volumes.json')) for b in v['books']))"); do
  uvx --with beautifulsoup4 --with pillow python tools/extract-book.py "../UI/$b.html" "books/$b.html" --art $art >/dev/null
done

made=()
while IFS='|' read -r slug title title_ar unit shelf frame blurb blurb_ar books; do
  if (( ${#want[@]} )); then
    case " ${want[*]} " in *" $slug "*) ;; *) continue ;; esac
  fi
  files=()
  for b in ${books//,/ }; do files+=("books/$b.html"); done
  list=$(IFS=,; echo "${files[*]}")
  for part in interior cover; do
    stem=$slug-$part$sfx
    flag=(); [[ $part == cover ]] && flag=(--cover)
    node tools/make-print.js "$list" "build/$stem.html" \
         --url "$BASE/" --lulu --art images ${extra[@]+"${extra[@]}"} \
         --volume "$title" --volume-ar "$title_ar" --unit "$unit" \
         --cover-qr "input/qr/$shelf.svg" --frame "$frame" \
         --blurb "$blurb" --blurb-ar "$blurb_ar" ${flag[@]+"${flag[@]}"}
    "$CHROME" --headless --no-pdf-header-footer \
         --print-to-pdf="$dest/$stem.pdf" "file://$PWD/build/$stem.html" 2>/dev/null
    printf '  %-48s %s\n' "$dest/$stem.pdf" "$(du -h "$dest/$stem.pdf" | cut -f1)"
    made+=("$dest/$stem.pdf")
  done
done < <(python3 -c "
import json
for v in json.load(open('tools/volumes.json')):
    print('|'.join([v['slug'], v['title'], v['title_ar'], v['unit'], v['shelf'], v['frame'], v.get('blurb', ''), v.get('blurb_ar', ''), ','.join(v['books'])]))")

(( ${#made[@]} )) || { echo "no volume matched: ${want[*]}" >&2; exit 1; }
echo; echo "checking words and type size…"
fail=0
for f in "${made[@]}"; do
  if [[ $f == *-cover* ]]; then
    # [site] covers too: contents fit, safety margin, spine, barcode area
    uvx -q --with zxing-cpp --with pillow python tools/check-cover-text.py \
        "build/$(basename "${f%.pdf}").html" "$f" || fail=1
    continue
  fi
  python3 tools/check-print-text.py "build/$(basename "${f%.pdf}").html" "$f" || fail=1
done
echo; echo "checking Lulu's rules…"
bash tools/check-lulu.sh "${made[@]}" || fail=1
echo; echo "checking QR codes…"
uvx --with zxing-cpp --with pillow python tools/check-qr.py "${made[@]}" || fail=1
echo; echo "checking scripture (verify-scripture on the print data)…"
python3 tools/verify-print-scripture.py --build "$( (( draft )) && echo draft || echo . )" || fail=1
(( fail )) && { echo; echo "build-volumes: a check failed — see above." >&2; exit 1; }
echo; echo "all checks passed"
