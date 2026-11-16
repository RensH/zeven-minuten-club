# Stemopnames

Zet hier korte opnames van een echte stem (mp3 of m4a, mono is prima) en maak een `clips.json`
die zegt welk bestand bij welke zin hoort. Zolang `clips.json` ontbreekt, gebruikt de app de
Engelse stem van het apparaat.

| sleutel | zin                              |
|---------|----------------------------------|
| ready   | Get ready!                       |
| go      | Go!                              |
| rest    | Rest.                            |
| side    | Switch sides!                    |
| half    | Halfway there!                   |
| last    | Last one. Give it everything!    |
| three   | Three!                           |
| two     | Two!                             |
| one     | One!                             |
| done    | Workout complete. Great job!     |

Voorbeeld `clips.json`:

```json
{ "ready": "ready.mp3", "go": "go.mp3", "rest": "rest.mp3", "side": "side.mp3", "half": "half.mp3",
  "last": "last.mp3", "three": "three.mp3", "two": "two.mp3", "one": "one.mp3", "done": "done.mp3" }
```

Een sleutel die ontbreekt valt terug op de apparaatstem.
