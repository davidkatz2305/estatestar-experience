# ESTATESTAR Experience — Version 03

Eigenständige kreative Designstudie auf Grundlage der Originalwebsite. Stand: 18.10.2026.

## Drei getrennte Versionen

- Original-Nachbau: https://davidkatz2305.github.io/estatestar-preview/
- Erste Optimierung: https://davidkatz2305.github.io/estatestar-optimiert/
- Diese Designstudie: https://davidkatz2305.github.io/estatestar-experience/

Die ersten beiden Projekte bleiben unverändert. Die dritte Version wird ausschließlich in diesem Repository entwickelt und veröffentlicht.

## Gestaltung und Inhalt

Originalschriften Michroma und Eurostile, Schwarz-Weiß und Originalorange statt Beige, dekorativer Zusatzstern entfernt. Filmischer Einstieg, native magnetische Kapitel auf Desktop und Mobil, Fotogalerie mit zwei großen Spalten auf Desktop und einer auf Mobilgeräten, sechs Projekten je Kategorie, Filmraum, sechs reale virtuelle Rundgänge, Digital Lab, KI-Angebotsentwurf, Team-Biografien und Kontakt. Acht Foto-Unterseiten und vier Rechtsseiten ergänzen die deutsche und englische Startseite.

Das Originalportfolio bleibt vollständig: 117 Fotos, 18 Filmeinträge mit 17 unterschiedlichen Filmen, sechs Touren, vier Teammitglieder. Neue Filmvorschaubilder sind unveränderte Einzelbilder aus den jeweiligen Filmen. `creative-content.json` dokumentiert Originalquellen und Zuordnungen; `posters/posters.json` ordnet die neuen Vorschauen zu.

KI-Leistungen sind als Angebotsentwurf gekennzeichnet. Der Bereich benennt drei geplante Leistungen ohne simulierte Bildbeweise. Es gibt keine erfundenen Kundenreferenzen oder Erfolgszahlen.

## Betrieb

Statische Dateien ohne Framework, Build-Service, Tracking oder Formular-Backend. GitHub Pages veröffentlicht den Stammordner von `main`; `.nojekyll` verhindert Jekyll-Verarbeitung. Alle Testseiten sind mit `noindex,nofollow` versehen.

Fotos, Logos, Schriften und vollständige Filme verwenden bewusst die bereits veröffentlichten Originalmedien unter `/estatestar-preview/`. Das Original-Repository muss deshalb erreichbar bleiben. Die 17 Film-Poster und der textfreie Hero-Ausschnitt liegen in diesem Repository. Der Hintergrund stammt aus dem bestehenden Airpark-Film, 00:18–00:26: acht Sekunden, stumm, 1280×720 auf Desktop und 720×1280 mobil. Der vollständige Showreel bleibt unverändert erreichbar. Externe Touren werden erst durch einen aktiven Link in einem neuen Tab geöffnet.

Das Kontaktformular bereitet ausschließlich einen `mailto:`-Entwurf vor. Es sendet keine Nachricht und speichert keine Formulardaten auf einem Server. Animationen und Einrasten respektieren `prefers-reduced-motion`. Hintergrundfilme pausieren außerhalb des sichtbaren Kapitels, in Dialogen und bei inaktivem Browser-Tab. Pausen- und Snap-Auswahl werden für die Browsersitzung gespeichert. Das Einrasten lässt sich sowohl im Menü als auch im Footer umschalten.

## Lokal ansehen und aktualisieren

Die Repositories `estatestar-preview` und `estatestar-experience` liegen nebeneinander. Einen lokalen Webserver im gemeinsamen übergeordneten Ordner starten und `/estatestar-experience/` aufrufen. Ein Build ist für die Vorschau nicht nötig.

Die fertigen HTML-Dateien liegen im Repository. Für eine Neuerzeugung: Python 3.12+ und `beautifulsoup4` installieren, dann `python3 build_home.py` und `python3 build_subpages.py` ausführen. Der zweite Generator liest die unveränderten Rechtstexte aus den entsprechenden Seiten des benachbarten Original-Nachbaus. Inhalte dieser Rechtstexte wurden übernommen, nicht juristisch neu bewertet.

## Prüfung

- Alle 14 Seiten, lokalen Links, Bildziele und Original-Fotoanker geprüft.
- Deutsche und englische Darstellung; Desktop und mobile Browsergrößen geprüft.
- Fotofilter, vollständige Galerie-Navigation, Filmfilter und echte Wiedergabe geprüft.
- Menü, Team-Biografien, native Bilddialoge, Pfeiltasten, Escape und Fokusführung geprüft; Menü-Kapitelwechsel fokussiert nun die Zielüberschrift.
- Mobile lange Kapitel bleiben zwischen den Einrastpunkten frei scrollbar.
- Kontaktentwurf geprüft; keine Testnachricht versendet.

Die Prüfung nutzt Browser-Ansichten in verschiedenen Größen, keine physischen Mobilgeräte. Lokale Prüfbilder und die Übergabenotiz liegen unter `research/` und werden nicht veröffentlicht.

## Designhilfen

Impeccable (https://github.com/pbakaus/impeccable) und Taste Skill (https://github.com/Leonxlnx/taste-skill) wurden geprüft und lokal installiert. Die Nutzeranweisung, die ursprüngliche ESTATESTAR-DNA zu erhalten, hat Vorrang vor generischen Skill-Vorschlägen. Entscheidungen und Quellen sind in `PRODUCT.md` und `DESIGN.md` dokumentiert.
