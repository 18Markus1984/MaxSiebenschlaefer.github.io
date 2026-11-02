---
title: Kabeltrenner 3000
year: 2026
summary: Längt Kabel ab und isoliert die Enden ab, bedient über den Browser.
category: elektronik
controller: ESP32
status: in Arbeit
order: 1
featured: true
specs:
  - label: Steuerung
    value: ESP32 mit CNC Shield V3
  - label: Antrieb
    value: Zwei Schrittmotoren mit TMC2209
  - label: Bedienung
    value: Weboberfläche mit Presets
  - label: Updates
    value: Über WLAN aus GitHub Releases
---

Wer schon einmal viele Kabel von Hand abgelängt und abisoliert hat, weiß, warum es diese Maschine gibt. Ein ESP32 steuert zwei Schrittmotoren: einer schiebt das Kabel vor, der andere führt den Messerkopf.

Bedient wird alles im Browser. Länge eingeben, Enden wählen, Start drücken. Vorlagen lassen sich speichern und teilen, und neue Firmware holt sich die Maschine selbst aus GitHub.

Gerade teste ich die neuen Funktionen an der echten Hardware.
