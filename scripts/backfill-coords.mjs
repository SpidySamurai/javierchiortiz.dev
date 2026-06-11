import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const cities = [
  { city: 'Bogotá', country: 'Colombia', country_code: 'CO' },
  { city: 'Dosquebradas', country: 'Colombia', country_code: 'CO' },
  { city: 'Apodaca', country: 'Mexico', country_code: 'MX' },
  { city: 'Guadalajara', country: 'Mexico', country_code: 'MX' },
  { city: 'Merida', country: 'Mexico', country_code: 'MX' },
  { city: 'Mérida', country: 'Mexico', country_code: 'MX' },
  { city: 'Monterrey', country: 'Mexico', country_code: 'MX' },
  { city: 'Lima', country: 'Peru', country_code: 'PE' },
  { city: 'Trujillo', country: 'Peru', country_code: 'PE' },
  { city: 'Brooklyn', country: 'United States', country_code: 'US' },
  { city: 'San Jose', country: 'United States', country_code: 'US' },
  { city: 'Mérida', country: 'Venezuela', country_code: 'VE' },
];

async function geocode(city, country) {
  const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'portfolio-backfill/1.0' } });
  const data = await res.json();
  if (!data[0]) return null;
  return { lat: parseFloat(parseFloat(data[0].lat).toFixed(2)), lng: parseFloat(parseFloat(data[0].lon).toFixed(2)) };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const { city, country, country_code } of cities) {
  const coords = await geocode(city, country);
  if (!coords) {
    console.log(`SKIP ${city}, ${country} — not found`);
    await sleep(1100);
    continue;
  }

  const { error, count } = await supabase
    .from('visitor_locations')
    .update({ latitude: coords.lat, longitude: coords.lng })
    .eq('city', city)
    .eq('country_code', country_code)
    .is('latitude', null);

  if (error) console.error(`ERROR ${city}: ${error.message}`);
  else console.log(`OK ${city}, ${country} → ${coords.lat}, ${coords.lng} (${count ?? '?'} rows)`);

  await sleep(1100);
}

console.log('Done.');
