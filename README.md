# Zeven Minuten Club

Houd samen bij wie de 7-minute workout heeft gedaan: streaks, 100%-score, workout-timer en confetti.

## Hoe het werkt

- `public/index.html` is de app.
- `netlify/functions/api.mjs` is een kleine API die de gegevens opslaat in **Netlify Blobs** (ingebouwde opslag van Netlify, geen extra account nodig).
- Elk lid is één opgeslagen bestand, zodat twee mensen die tegelijk afvinken elkaar niet overschrijven.
- De app ververst elke 20 seconden, zodat je elkaars vinkjes ziet.

## Workouts

`public/oefeningen.js` bevat 54 oefeningen (cardio, benen & billen, armen & bovenlijf, buik & core) met geanimeerde voorbeelden. Elke dag wordt er per focus een nieuwe workout van 12 oefeningen samengesteld; iedereen met dezelfde focus krijgt dezelfde workout.

## Is mijn data veilig bij een nieuwe deploy?

Ja. De gegevens staan in Netlify Blobs (site-brede store `zeven-minuten-club`), los van de code. Een nieuwe deploy naar dezelfde site laat ze staan. Deploy je naar een **andere** site, dan begin je daar leeg.

## Deployen

De site staat op GitHub en Netlify bouwt automatisch: elke push naar `main` gaat binnen een minuut live.
Er is geen build-stap nodig; Netlify installeert zelf de pakketten uit `package.json`.

Handmatig deployen kan nog steeds:
```bash
npm install
npx netlify-cli deploy --prod
```

## Groepscode (aangeraden)

Een Netlify-site is openbaar. Zet in Netlify onder *Site configuration → Environment variables* een variabele `ACCESS_CODE` met een code naar keuze (bijv. `burpee42`) en deploy opnieuw. Iedereen vult die code één keer in; daarna onthoudt de browser hem.

## Iemand verwijderen

```bash
curl -X DELETE https://<jouw-site>.netlify.app/api/people/<id> -H "x-group-code: <code>"
```
De `id` vind je via `https://<jouw-site>.netlify.app/api/people`.
