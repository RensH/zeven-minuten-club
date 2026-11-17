# Stemopnames

De coach-stem is **Amy** (`en_US-amy-medium`) van [Piper](https://github.com/OHF-Voice/piper1-gpl).
Alle zinnen en de Engelse namen van de oefeningen zijn vooraf als mp3 gemaakt, zodat de app
geen stem van het apparaat nodig heeft. `clips.json` koppelt elke sleutel aan een bestand.

- Coach-zinnen: `ready`, `rest`, `side`, `half`, `last`, `done`
- Aftellen: `three`, `two`, `one`
- Oefeningen: `ex-<id>` (bijvoorbeeld `ex-pushups`)

Opnieuw maken (bijvoorbeeld na het toevoegen van een oefening): zet `en_US-amy-medium.onnx` en
`en_US-amy-medium.onnx.json` in `tools/` en draai `python3 tools/stem-genereren.py`.

Stem: Piper-stem "amy", getraind op een dataset van het Mycroft mimic3-project; zie het
MODEL_CARD van de stem voor de licentie.
