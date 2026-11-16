// Zeven Minuten Club API: slaat leden en afgevinkte dagen op in Netlify Blobs.
// Elk lid is één blob ("people/<id>"), zodat twee mensen tegelijk afvinken elkaar niet overschrijven.
import { getStore } from "@netlify/blobs";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export default async (req) => {
  // Optionele groepscode: zet ACCESS_CODE in de Netlify-omgevingsvariabelen om de app af te schermen.
  const code = process.env.ACCESS_CODE;
  if (code && req.headers.get("x-group-code") !== code) {
    return json({ error: "Groepscode ontbreekt of klopt niet." }, 401);
  }

  const store = getStore({ name: "zeven-minuten-club", consistency: "strong" });
  const url = new URL(req.url);
  const parts = url.pathname.replace(/^\/(\.netlify\/functions\/api|api)\/?/, "").split("/").filter(Boolean);

  try {
    // GET /api/people
    if (req.method === "GET" && parts[0] === "people" && parts.length === 1) {
      const { blobs } = await store.list({ prefix: "people/" });
      const people = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
      return json(people.filter(Boolean));
    }

    // POST /api/people  { name, start }
    if (req.method === "POST" && parts[0] === "people" && parts.length === 1) {
      const body = await req.json().catch(() => ({}));
      const name = String(body.name || "").trim().replace(/\s+/g, " ").slice(0, 24);
      if (!name) return json({ error: "Vul je naam in." }, 400);

      const { blobs } = await store.list({ prefix: "people/" });
      const people = (await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })))).filter(Boolean);
      if (people.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
        return json({ error: `“${name}” bestaat al. Tik op je naam hierboven.` }, 409);
      }
      if (people.length >= 20) return json({ error: "De club zit vol (maximaal 20 leden)." }, 400);

      const used = new Set(people.map((p) => p.color));
      let color = 0;
      while (used.has(color) && color < 8) color++;

      const start = DATE.test(body.start) ? body.start : new Date().toISOString().slice(0, 10);
      const person = {
        id: crypto.randomUUID().slice(0, 12),
        name,
        start,
        created: Date.now(),
        color: color % 8,
        days: {},
      };
      await store.setJSON(`people/${person.id}`, person);
      return json(person, 201);
    }

    // POST /api/people/:id/day  { date, done }
    if (req.method === "POST" && parts[0] === "people" && parts.length === 3 && parts[2] === "day") {
      const id = parts[1];
      const body = await req.json().catch(() => ({}));
      if (!DATE.test(body.date)) return json({ error: "Ongeldige datum." }, 400);

      // Alleen wegschrijven als niemand anders dit lid intussen heeft aangepast; anders opnieuw proberen.
      for (let attempt = 0; attempt < 4; attempt++) {
        const entry = await store.getWithMetadata(`people/${id}`, { type: "json" });
        if (!entry || !entry.data) return json({ error: "Dit lid bestaat niet meer. Herlaad de pagina." }, 404);
        const person = entry.data;
        person.days = person.days || {};
        if (body.done) person.days[body.date] = true;
        else delete person.days[body.date];
        const { modified } = await store.setJSON(`people/${id}`, person, { onlyIfMatch: entry.etag });
        if (modified) return json(person);
      }
      return json({ error: "Iemand anders paste dit net aan. Probeer het opnieuw." }, 409);
    }

    // DELETE /api/people/:id  (voor opruimen; alleen bruikbaar met de groepscode als die is ingesteld)
    if (req.method === "DELETE" && parts[0] === "people" && parts.length === 2) {
      await store.delete(`people/${parts[1]}`);
      return json({ ok: true });
    }

    return json({ error: "Niet gevonden." }, 404);
  } catch (err) {
    console.error(err);
    return json({ error: "Er ging iets mis bij het opslaan. Probeer het opnieuw." }, 500);
  }
};

export const config = { path: ["/api/*"] };
