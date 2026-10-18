#!/usr/bin/env python3
"""Build photographic collections and preserve the original legal page content.

Requires beautifulsoup4. Run from any directory. Original source files are read
from the neighbouring estatestar-preview directory.
Only the eight gallery and four legal page index files are generated.
"""
from __future__ import annotations

import html
import json
from pathlib import Path
import re

from bs4 import BeautifulSoup, Tag

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parent / 'estatestar-preview'
DATA = json.loads((ROOT / 'creative-content.json').read_text())
ESC = lambda text: html.escape(str(text), quote=True)
ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M13 5l7 7-7 7"/></svg>'
BACK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H4m7-7-7 7 7 7"/></svg>'
CLOSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>'
PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'
GALLERIES = [
    ('luftbilder', 'luftaufnahmen', 'aerials', 'Luftbilder', 'Aerials', 'Architektur aus einer anderen Perspektive.', 'Architecture from another perspective.'),
    ('exterieur', 'exterieur', 'exterior', 'Exterieur', 'Exterior', 'Form. Fassade. Charakter.', 'Form. Façade. Character.'),
    ('interieur', 'interieur', 'interior', 'Interieur', 'Interior', 'Räume, die eine Geschichte erzählen.', 'Spaces that tell a story.'),
    ('nacht', 'nachtaufnahmen', 'night', 'Nacht', 'Night', 'Wenn Architektur zu leuchten beginnt.', 'When architecture begins to glow.'),
]


def home(lang: str, anchor: str = '') -> str:
    return ('../en/' if lang == 'en' else '../') + anchor


def header(lang: str, de_slug: str, en_slug: str, gallery: bool) -> str:
    back = ('Back to photography' if lang == 'en' else 'Zur Fotografie') if gallery else ('Back to home' if lang == 'en' else 'Zur Startseite')
    return f'''<a class="skip-link" href="#main">{'Skip to content' if lang == 'en' else 'Zum Inhalt'}</a>
<header class="site-header"><a class="brand" href="{home(lang)}" aria-label="ESTATESTAR — {'Home' if lang == 'en' else 'Startseite'}"><img src="{ESC(DATA['brandAssets']['logoBlack'])}" alt="ESTATESTAR" width="180" height="40"></a>
<div class="header-tools"><a class="back-link" aria-label="{back}" href="{home(lang, '#photo' if gallery else '')}">{BACK}<span>{back}</span></a><nav class="languages" aria-label="{'Language' if lang == 'en' else 'Sprache'}"><a href="../{de_slug}/" lang="de" hreflang="de" {'aria-current="page"' if lang == 'de' else ''}>DE</a><a href="../{en_slug}/" lang="en" hreflang="en" {'aria-current="page"' if lang == 'en' else ''}>EN</a></nav></div></header>'''


def footer(lang: str) -> str:
    en = lang == 'en'
    return f'''<footer class="site-footer"><div class="footer-top"><div><p class="footer-line">{'Talk to ESTATESTAR.' if en else 'Sprechen Sie mit ESTATESTAR.'}</p><div class="footer-contact"><a href="mailto:studio@estatestar.de">studio@estatestar.de</a><a href="tel:+491631323649">+49 163 132 36 49</a></div></div><a class="footer-home" href="{home(lang, '#contact')}">{'Start a conversation' if en else 'Projekt besprechen'} {ARROW}</a></div><div class="footer-bottom"><span>ESTATESTAR · PHOTO FILM 360 · BERLIN</span><nav class="footer-legal" aria-label="{'Legal information' if en else 'Rechtliche Informationen'}"><a href="../{'imprint' if en else 'impressum'}/">{'Imprint' if en else 'Impressum'}</a><a href="../{'dataprotection' if en else 'datenschutz'}/">{'Data protection' if en else 'Datenschutz'}</a></nav></div></footer>'''


def document(lang: str, title: str, description: str, body: str, gallery: bool = False) -> str:
    return f'''<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#ffffff"><title>{ESC(title)} — ESTATESTAR</title><meta name="description" content="{ESC(description)}"><link rel="icon" href="/estatestar-preview/wp-content/uploads/2022/12/cropped-Estatestar-logo-32x32.png" type="image/png" sizes="32x32"><link rel="icon" href="/estatestar-preview/wp-content/uploads/2022/12/cropped-Estatestar-logo-192x192.png" type="image/png" sizes="192x192"><link rel="apple-touch-icon" href="/estatestar-preview/wp-content/uploads/2022/12/cropped-Estatestar-logo-180x180.png"><link rel="stylesheet" href="../gallery.css">{'<script src="../gallery.js" defer></script>' if gallery else ''}</head><body>{body}</body></html>
'''


def display_title(photo: dict, lang: str) -> str:
    title = photo['title']
    if photo['titleSource'] == 'descriptive original filename':
        title = re.sub(r'^\d+\s+', '', title)
        title = re.sub(r'\b(?:Drohnenfoto|Helikopter|Hubschrauber|Luftbild|Immobilienfotografie)\s*', '', title).strip()
        for before, after in [('Duesseldorf', 'Düsseldorf'), ('Muenchen', 'München'), ('Goerlitz', 'Görlitz'), ('Gedaechtniskirche', 'Gedächtniskirche'), ('Oberbaumbruecke', 'Oberbaumbrücke'), ('Tuerkei', 'Türkei'), ('Treppenhaus', 'Treppenhaus'), ('Bueroraeume', 'Büroräume')]:
            title = title.replace(before, after)
    return title


def make_gallery(info: tuple, lang: str) -> None:
    category, de_slug, en_slug, de_title, en_title, de_description, en_description = info
    en = lang == 'en'
    slug, title, description = (en_slug, en_title, en_description) if en else (de_slug, de_title, de_description)
    photos = DATA['fullPhotos'][category]
    nav = ''.join(f'<a href="../{g[2] if en else g[1]}/" {"aria-current=\"page\"" if g[0] == category else ""}>{ESC(g[4] if en else g[3])}</a>' for g in GALLERIES)
    cards = []
    for i, photo in enumerate(photos):
        name = display_title(photo, lang)
        portrait = ' is-portrait' if photo['height'] > photo['width'] else ''
        cards.append(f'''<figure class="photo-card{portrait}" id="{ESC(photo['originalSection'])}"><button class="image-button" type="button" data-gallery-image="{ESC(photo['image'])}" data-title="{ESC(name)}" aria-haspopup="dialog" aria-controls="image-viewer" aria-label="{ESC(('View image: ' if en else 'Bild ansehen: ') + name)}"><img src="{ESC(photo['image'])}" alt="{ESC(name)}" width="{photo['width']}" height="{photo['height']}" loading="{'eager' if i == 0 else 'lazy'}" decoding="async"><span class="view-image">{PLUS}</span></button><figcaption class="photo-caption"><span class="photo-title">{ESC(name)}</span><span class="photo-number">{i + 1:02d}</span></figcaption></figure>''')
    dialog = f'''<dialog class="image-dialog" id="image-viewer" aria-label="{'Photograph viewer' if en else 'Fotoansicht'}" aria-describedby="viewer-help"><div class="dialog-layout"><div class="dialog-top"><span class="dialog-category label">ESTATESTAR / {ESC(title)}</span><button class="icon-button" type="button" data-close aria-label="{'Close' if en else 'Schließen'}">{CLOSE}</button></div><div class="dialog-stage"><img class="dialog-image" alt=""></div><div class="dialog-bottom"><div class="dialog-title" aria-live="polite"></div><div class="dialog-controls"><button class="icon-button" type="button" data-prev aria-label="{'Previous image' if en else 'Vorheriges Bild'}">{BACK}</button><span class="dialog-counter" aria-live="polite"></span><button class="icon-button" type="button" data-next aria-label="{'Next image' if en else 'Nächstes Bild'}">{ARROW}</button></div><div class="dialog-hint" id="viewer-help">{'Arrow keys: browse<br>Esc: close' if en else 'Pfeiltasten: blättern<br>Esc: schließen'}</div></div></div></dialog>'''
    main = f'''<main id="main"><section class="page-intro" aria-labelledby="page-title"><h1 id="page-title">{ESC(title)}</h1><div class="intro-bottom"><p class="intro-description">{ESC(description)}</p><p class="image-count">{len(photos):02d} {'photographs' if en else 'Aufnahmen'} / ESTATESTAR</p></div></section><nav class="gallery-nav" aria-label="{'Photo collections' if en else 'Fotoserien'}">{nav}</nav><section class="gallery" aria-label="{ESC(title)}"><div class="gallery-grid">{''.join(cards)}</div><div class="collection-end"><span>{'End of collection' if en else 'Ende der Serie'} · {len(photos):02d}</span><a href="{home(lang, '#photo')}">{'All photography' if en else 'Zur Fotoübersicht'} {ARROW}</a></div></section></main>'''
    write(slug, document(lang, title, description, header(lang, de_slug, en_slug, True) + main + footer(lang) + dialog, True))


def original_legal(slug: str) -> tuple[str, str]:
    soup = BeautifulSoup((SOURCE / slug / 'index.html').read_text(), 'html.parser')
    widgets = soup.select('[data-elementor-type="wp-page"] .elementor-widget-heading, [data-elementor-type="wp-page"] .elementor-widget-text-editor')
    if not widgets:
        raise ValueError(f'No original legal content found: {slug}')
    title = widgets[0].get_text(' ', strip=True)
    original_text = ''.join(w.get_text() for w in widgets[1:])
    output = []
    for widget in widgets[1:]:
        container = widget.select_one('.elementor-widget-container')
        if container is None:
            raise ValueError(f'Content container missing: {slug}')
        for node in container.find_all(True):
            node.attrs = {k: v for k, v in node.attrs.items() if k in ('href', 'target', 'rel')}
            if node.name == 'a' and node.get('target') == '_blank':
                node['rel'] = 'noopener noreferrer'
        output.append(container.decode_contents())
    result = ''.join(output)
    extracted_text = BeautifulSoup(result, 'html.parser').get_text()
    normalize = lambda text: re.sub(r'\s+', '', text)
    if normalize(original_text) != normalize(extracted_text):
        raise ValueError(f'Legal text has changed: {slug}')
    return title, result


def make_legal(de_slug: str, en_slug: str, lang: str) -> None:
    slug = en_slug if lang == 'en' else de_slug
    title, content = original_legal(slug)
    main = f'''<main id="main"><section class="page-intro legal-intro"><h1>{ESC(title)}</h1></section><div class="legal-layout"><aside class="legal-side"><span class="label">ESTATESTAR<br>PHOTO FILM 360<br>BERLIN</span></aside><article class="legal-content">{content}</article></div></main>'''
    write(slug, document(lang, title, 'ESTATESTAR — ' + title, header(lang, de_slug, en_slug, False) + main + footer(lang)))


def write(slug: str, content: str) -> None:
    folder = ROOT / slug
    folder.mkdir(exist_ok=True)
    (folder / 'index.html').write_text(content)


if __name__ == '__main__':
    for entry in GALLERIES:
        for language in ('de', 'en'):
            make_gallery(entry, language)
    for legal in [('impressum', 'imprint'), ('datenschutz', 'dataprotection')]:
        for language in ('de', 'en'):
            make_legal(*legal, language)
    print('Built 8 gallery pages (117 photographs per language) and 4 legal pages with unchanged original text.')
