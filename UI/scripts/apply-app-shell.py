#!/usr/bin/env python3
"""Move v1 pages onto the Illuminated Page v2 app shell (UI/DESIGN.md 7.1-7.2).

Replaces the floating decorations and the v1 header with the app bar and tab
bar, drops the Google Fonts links (fonts are self-hosted), adds app.css, the
manifest and icons, and marks the surah screen's main, stage picker and footer.
Content is not touched: nothing between the hero and the footer changes except
the three attributes named above. Idempotent: a page that already has the app
bar is left alone. Generated surah pages get the same strings from
surah-page-template.py, which imports app_shell.py.

Usage:  python3 scripts/apply-app-shell.py            (every eligible page)
        python3 scripts/apply-app-shell.py surah-al-asr.html ...
"""
import glob
import importlib.util
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
UI = os.path.dirname(HERE)
spec = importlib.util.spec_from_file_location('app_shell', os.path.join(HERE, 'app_shell.py'))
shell = importlib.util.module_from_spec(spec)
spec.loader.exec_module(shell)

TABS = {'stories.html': 'stories.html', 'quran.html': 'quran.html'}


def kind(name):
    if name in TABS:
        return 'tab'
    if name.startswith('surah-') or name == 'ayat-al-kursi.html':
        return 'surah'
    return None


def main(names):
    names = names or sorted(os.path.basename(p) for p in glob.glob(os.path.join(UI, '*.html')))
    for name in names:
        k = kind(name)
        if not k:
            continue
        path = os.path.join(UI, name)
        html = open(path, encoding='utf-8').read()
        out = shell.convert(html, k, TABS.get(name))
        if out != html:
            open(path, 'w', encoding='utf-8').write(out)
            print('shell  ', name)
        else:
            print('as-is  ', name)


if __name__ == '__main__':
    main(sys.argv[1:])
