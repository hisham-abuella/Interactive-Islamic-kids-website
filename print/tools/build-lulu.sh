#!/usr/bin/env bash
# Build the Lulu editions of one or more site pages, then check them.
#
#   print/tools/build-lulu.sh [--draft] [--long] <page> [<page>...]
#   print/tools/build-lulu.sh --draft --long story-prophet-nuh
#
# <page> is a page of the site without .html: story-prophet-nuh, surah-al-fil.
# Ported from ~/Work/bedtime-stories/tools/build-lulu.sh and print-book.sh: the
# layout is make-print.js --lulu, unchanged; only the input is new
# (extract-book.py turns the page into the BOOK data make-print.js reads).
#
# Two PDFs per book, because Lulu takes the interior and the cover as separate
# uploads and the cover is a single back + spine + front spread:
#   <page>-lulu-interior.pdf   8.5in square + 0.125in bleed, no marks, no folio
#   <page>-lulu-cover.pdf      back + spine + front, spine from the real page count
#
# Pictures: a print master per plate in input/img-hi/ (see the print-art job in
# claudeteam/reviews/book-plan-*.md). With any missing this stops — printing
# the 960px web plates would ship pages under 300ppi. --draft builds a layout
# preview from the web plates instead, stamped DRAFT, into draft/ with a -draft
# suffix; its ppi check is expected to fail.
#
# A single story or surah is under Lulu's 32-page perfect-bound minimum; on its
# own it is a review copy, not an upload. Bind books as volumes with
# build-volumes.sh. check-lulu.sh says so on the page count line.
#
# NOT a board book: Lulu does not make them.
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE="https://hisham-abuella.github.io/Interactive-Islamic-kids-website/UI"
draft=0 extra=() pages=()
while (( $# )); do
  case $1 in
    --draft) draft=1 ;;
    --long)  extra+=(--long) ;;
    -*) echo "build-lulu: unknown option $1" >&2; exit 2 ;;
    *) pages+=("$1") ;;
  esac
  shift
done
(( ${#pages[@]} )) || { echo "usage: build-lulu.sh [--draft] [--long] <page>..." >&2; exit 2; }

art=hi dest=. sfx=''
(( draft )) && { art=draft dest=draft sfx=-draft; }
mkdir -p build books "$dest"
made=()
for p in "${pages[@]}"; do
  [[ -f ../UI/$p.html ]] || { echo "no UI/$p.html" >&2; exit 1; }
  [[ -f input/qr/qr-$p.svg ]] || uvx --with segno python tools/make-qr.py >/dev/null
  uvx --with beautifulsoup4 --with pillow python tools/extract-book.py "../UI/$p.html" "books/$p.html" --art $art >/dev/null
  for part in interior cover; do
    stem=$p-lulu-$part$sfx
    flag=(); [[ $part == cover ]] && flag=(--cover)
    node tools/make-print.js "books/$p.html" "build/$stem.html" \
         --url "$BASE/$p.html" --qr "input/qr/qr-$p.svg" --lulu --art images \
         ${extra[@]+"${extra[@]}"} ${flag[@]+"${flag[@]}"}
    "$CHROME" --headless --no-pdf-header-footer \
         --print-to-pdf="$dest/$stem.pdf" "file://$PWD/build/$stem.html" 2>/dev/null
    printf '  %-56s %s\n' "$dest/$stem.pdf" "$(du -h "$dest/$stem.pdf" | cut -f1)"
    made+=("$dest/$stem.pdf")
  done
done

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
(( fail )) && { echo; echo "build-lulu: a check failed — see above." >&2; exit 1; }
echo; echo "all checks passed"
