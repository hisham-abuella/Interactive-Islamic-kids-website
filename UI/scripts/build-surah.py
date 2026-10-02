#!/usr/bin/env python3
"""Render a surah page from its spec in scripts/specs/ into UI/<slug>.html.

Usage:  python3 scripts/build-surah.py surah_ad_duha [surah_ash_sharh ...]
"""
import importlib.util
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
UI = os.path.dirname(HERE)


def load(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


template = load(os.path.join(HERE, 'surah-page-template.py'), 'surah_page_template')

for name in sys.argv[1:]:
    mod = load(os.path.join(HERE, 'specs', name + '.py'), name)
    out = os.path.join(UI, mod.SPEC['slug'] + '.html')
    with open(out, 'w', encoding='utf-8') as fh:
        fh.write(template.page(mod.SPEC))
    print('wrote %s (%d bytes)' % (os.path.relpath(out, UI), os.path.getsize(out)))
