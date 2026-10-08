#!/usr/bin/env python3
"""Check the scene plates against the pages that reference them.

Three things can rot here and none of them is visible until a child opens the
page: a scene gains a plate in the spec but never gets wired into the HTML, a
page points at a file that was never rendered, or a plate quietly ships at
PNG weight and costs a minute of loading on a phone. All three are cheap to
assert, so assert them.

    python3 scripts/verify-illustrations.py
"""

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from specs.illustrations import PLATES  # noqa: E402
from specs import surah_plates  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent

# A plate is a decorative miniature, so it must not be announced; the scene
# text already carries everything it depicts.
PLATE_RE = re.compile(r'<img class="scene-plate" src="([^"]+)"([^>]*)>')
COVER_RE = re.compile(r'<img class="story-cover" src="([^"]+)"([^>]*)>')
SCENE_RE = re.compile(r'<div class="(story-scene[^"]*)" data-scene="(\d+)"')

# Generous: a plate that lands here is still half the weight of the PNG it
# came from, but one that blows past it has skipped the conversion step.
MAX_KB = 160


class SceneStructure(HTMLParser):
    """Does each scene still *contain* its plate and its text?

    Worth parsing rather than grepping. Wiring the plates in with a regex put
    one stray </div> into two pages, which closed the scene early and left
    .scene-text outside it — on screen the picture rendered straight through
    the words. A string search cannot see that; a parser can.
    """

    VOID = {"img", "br", "meta", "link", "input", "hr", "source", "area", "col"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.scenes = {}
        self.open_scene = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class", "")
        if self.open_scene is not None:
            if "scene-plate" in cls:
                self.scenes[self.open_scene]["plate"] += 1
            if "scene-text" in cls:
                self.scenes[self.open_scene]["text"] += 1
        if tag in self.VOID:
            return
        self.stack.append(tag)
        if "story-scene" in cls and a.get("data-scene"):
            self.open_scene = int(a["data-scene"])
            self.scenes[self.open_scene] = {"depth": len(self.stack), "plate": 0, "text": 0}

    def handle_endtag(self, tag):
        if not self.stack:
            return
        if self.open_scene is not None and len(self.stack) == self.scenes[self.open_scene]["depth"]:
            self.open_scene = None
        self.stack.pop()


def check_structure(page: Path, problems: list) -> None:
    p = SceneStructure()
    p.feed(page.read_text())
    for n, got in sorted(p.scenes.items()):
        if got["plate"] != 1:
            problems.append(
                f"{page.name}: scene {n} encloses {got['plate']} plates, expected exactly 1 "
                f"(a stray </div> closes the scene early)"
            )
        if got["text"] != 1:
            problems.append(
                f"{page.name}: scene {n} encloses {got['text']} .scene-text blocks, expected exactly 1 "
                f"(the text has fallen outside the scene and the plate will overlap it)"
            )


def main() -> int:
    problems = []
    checked = 0

    for story, plates in PLATES.items():
        page = ROOT / f"story-{story}.html"
        if not page.exists():
            problems.append(f"{story}: no page at {page.name}")
            continue
        src = page.read_text()
        check_structure(page, problems)

        if 'href="stories.css?v=' not in src:
            problems.append(
                f"{page.name}: stories.css is linked without a ?v= — a returning visitor "
                f"gets cached CSS with new markup, and the plates overflow their scenes"
            )

        scenes = {int(n): cls for cls, n in SCENE_RE.findall(src)}
        expected = {k for k in plates if k != "cover"}
        if set(scenes) != expected:
            problems.append(
                f"{page.name}: scenes on the page {sorted(scenes)} do not match the spec {sorted(expected)}"
            )

        wired = dict(
            (int(m.group(1).rsplit("scene-", 1)[1].split(".")[0]), m)
            for m in PLATE_RE.finditer(src)
        )
        for n in sorted(expected):
            if n not in wired:
                problems.append(f"{page.name}: scene {n} has no plate")
                continue
            if "has-plate" not in scenes.get(n, ""):
                problems.append(f"{page.name}: scene {n} has a plate but no .has-plate class")
            attrs = wired[n].group(2)
            if 'alt=""' not in attrs:
                problems.append(f"{page.name}: scene {n} plate must have an empty alt")
            if 'loading="lazy"' not in attrs:
                problems.append(f"{page.name}: scene {n} plate is not lazy-loaded")

        for m in PLATE_RE.finditer(src):
            checked += check_file(m.group(1), page.name, problems)

    hub = ROOT / "stories.html"
    covers = COVER_RE.findall(hub.read_text())
    if len(covers) != len(PLATES):
        problems.append(f"stories.html: {len(covers)} cover images for {len(PLATES)} stories")
    for src_attr, attrs in covers:
        checked += check_file(src_attr, "stories.html", problems)
        if 'alt=""' not in attrs:
            problems.append(f"stories.html: cover {src_attr} must have an empty alt")

    checked += check_surahs(problems)

    if problems:
        print("Illustration problems:\n")
        for p in problems:
            print(f"  {p}")
        return 1

    total = sum(f.stat().st_size for f in (ROOT / "images").rglob("*.webp"))
    print(
        f"All {checked} plates present, decorative, lazy-loaded and within "
        f"{MAX_KB} KB each.\nTotal art on disk: {total / 1024 / 1024:.1f} MB "
        f"across {len(PLATES)} stories and {len(surah_plates.PLATES)} surah pages."
    )
    return 0


VERSE_PLATE_RE = re.compile(
    r'<figure class="verse-plate"><img src="([^"]+)"([^>]*)></figure>\s*'
    r'(?:<!-- /surah-plate -->\s*)?<div class="verse-card" data-verse="(\d+)">'
)


def check_surahs(problems: list) -> int:
    """Each surah plate sits directly above the verse card the spec names.

    The same cached-stylesheet trap as the stories applies: the plate carries
    width="960", so a page served with an old surah.css shows it at full size
    on a phone. Hence the ?v= check.
    """
    checked = 0
    for slug, plates in surah_plates.PLATES.items():
        page = ROOT / f"{slug}.html"
        src = page.read_text()
        if 'href="surah.css?v=' not in src:
            problems.append(f"{page.name}: surah.css is linked without a ?v=")
        wired = {int(v): (img, attrs) for img, attrs, v in VERSE_PLATE_RE.findall(src)}
        if src.count('class="verse-plate"') != len(wired):
            problems.append(f"{page.name}: a plate is not directly above a verse card")
        if set(wired) != set(plates):
            problems.append(
                f"{page.name}: plates above verses {sorted(wired)} do not match the spec {sorted(plates)}"
            )
        for v, (img, attrs) in sorted(wired.items()):
            if img != f"images/surahs/{slug}/verse-{v}.webp":
                problems.append(f"{page.name}: verse {v} shows {img}")
            if 'alt=""' not in attrs or 'loading="lazy"' not in attrs:
                problems.append(f"{page.name}: verse {v} plate must be alt=\"\" and lazy-loaded")
            checked += check_file(img, page.name, problems)
    for slug in ("surah-fatiha", "surah-al-ikhlas"):
        if 'class="calligraphy-panel"' not in (ROOT / f"{slug}.html").read_text():
            problems.append(f"{slug}.html: the calligraphy panel is missing")
    if not (ROOT / "images" / "surahs" / "illuminated-frame.webp").exists():
        problems.append("images/surahs/illuminated-frame.webp does not exist")
    return checked


def check_file(rel: str, page: str, problems: list) -> int:
    f = ROOT / rel
    if not f.exists():
        problems.append(f"{page}: {rel} does not exist")
        return 0
    kb = f.stat().st_size / 1024
    if kb > MAX_KB:
        problems.append(f"{page}: {rel} is {kb:.0f} KB, over the {MAX_KB} KB budget")
    return 1


if __name__ == "__main__":
    sys.exit(main())
