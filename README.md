# ESTATESTAR Experience — Version 03

Eigenständige kreative Designstudie auf Grundlage der Originalwebsite. Stand: 18.10.2026.

## Drei getrennte Versionen

- Original-Nachbau: https://davidkatz2305.github.io/estatestar-preview/
- Erste Optimierung: https://davidkatz2305.github.io/estatestar-optimiert/
- Diese Designstudie: https://davidkatz2305.github.io/estatestar-experience/

Die ersten beiden Projekte bleiben unverändert. Die dritte Version wird ausschließlich in diesem Repository entwickelt und veröffentlicht.

## Gestaltung und Inhalt

Filmischer Einstieg, native magnetische Kapitel auf Desktop und Mobil, horizontale Fotogalerie, Filmraum, sechs reale virtuelle Rundgänge, Digital Lab, KI-Angebotsentwurf, Team-Biografien und Kontakt. Acht Foto-Unterseiten und vier Rechtsseiten ergänzen die deutsche und englische Startseite.

Das Originalportfolio bleibt vollständig: 117 Fotos, 18 Filmeinträge mit 17 unterschiedlichen Filmen, sechs Touren, vier Teammitglieder. Neue Filmvorschaubilder sind unveränderte Einzelbilder aus den jeweiligen Filmen. `creative-content.json` dokumentiert Originalquellen und Zuordnungen; `posters/posters.json` ordnet die neuen Vorschauen zu.

KI-Leistungen sind als Angebotsentwurf gekennzeichnet. Die dortigen Bilder sind ausdrücklich Originalaufnahmen als mögliche Arbeitsgrundlage, keine KI-Ergebnisse. Es gibt keine erfundenen Kundenreferenzen oder Erfolgszahlen.

## Betrieb

Statische Dateien ohne Framework, Build-Service, Tracking oder Formular-Backend. GitHub Pages veröffentlicht den Stammordner von `main`; `.nojekyll` verhindert Jekyll-Verarbeitung. Alle Testseiten sind mit `noindex,nofollow` versehen.

Fotos, Logos, Schriften und vollständige Filme verwenden bewusst die bereits veröffentlichten Originalmedien unter `/estatestar-preview/`. Das Original-Repository muss deshalb erreichbar bleiben. Die 17 neuen Film-Poster liegen in diesem Repository. Externe Touren werden erst durch einen aktiven Link in einem neuen Tab geöffnet.

Das Kontaktformular bereitet ausschließlich einen `mailto:`-Entwurf vor. Es sendet keine Nachricht und speichert keine Formulardaten auf einem Server. Animationen und Einrasten respektieren `prefers-reduced-motion`. Hintergrundfilme pausieren außerhalb des sichtbaren Kapitels, in Dialogen und bei inaktivem Browser-Tab. Pausen- und Snap-Auswahl werden für die Browsersitzung gespeichert.

## Lokal ansehen und aktualisieren

Die Repositories `estatestar-preview` und `estatestar-experience` liegen nebeneinander. Einen lokalen Webserver im gemeinsamen übergeordneten Ordner starten und `/estatestar-experience/` aufrufen. Ein Build ist für die Vorschau nicht nötig.

Die fertigen HTML-Dateien liegen im Repository. Für eine Neuerzeugung: Python 3.12+ und `beautifulsoup4` installieren, dann `python3 build_home.py` und `python3 build_subpages.py` ausführen. Der zweite Generator liest die unveränderten Rechtstexte aus den entsprechenden Seiten des benachbarten Original-Nachbaus. Inhalte dieser Rechtstexte wurden übernommen, nicht juristisch neu bewertet.

## Prüfung

- Alle 14 Seiten, lokalen Links, Bildziele und Original-Fotoanker geprüft.
- Deutsche und englische Darstellung; Desktop und mobile Browsergrößen geprüft.
- Fotofilter, Galerie-Navigation einschließlich Rückwärtsblättern am Ende, Filmfilter und echte Wiedergabe geprüft.
- Menü, Team-Biografien, native Bilddialoge, Pfeiltasten, Escape und Fokusretour geprüft.
- Mobile lange Kapitel bleiben zwischen den Einrastpunkten frei scrollbar.
- Kontaktentwurf geprüft; keine Testnachricht versendet.

Die Prüfung nutzt Browser-Ansichten in verschiedenen Größen, keine physischen Mobilgeräte. Lokale Prüfbilder und die Übergabenotiz liegen unter `research/` und werden nicht veröffentlicht.
