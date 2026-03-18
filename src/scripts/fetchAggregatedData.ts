/*
Fetch the aggregated data from the API
Taken from UTD Trends; run with npm run fetchdata
*/
import { writeFileSync } from 'fs';
import 'dotenv/config';

const API_URL = process.env.NEBULA_API_URL;
if (typeof API_URL !== 'string') {
  console.error('API URL is undefined');
} else {
  const headers = {
    'x-api-key': API_URL,
    Accept: 'application/json',
  };

  await fetch('https://api.utdnebula.com/autocomplete/dag', {
    method: 'GET',
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      writeFileSync('src/data/aggregated_data.json', JSON.stringify(data));

      console.log('Aggregated data fetched.');
    });
}
