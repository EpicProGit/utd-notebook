/*
Fetch the aggregated data from the API
Taken from UTD Trends
*/
import { writeFileSync } from 'fs';
import 'dotenv/config';

const API_KEY = process.env.NEBULA_API_KEY;
if (typeof API_KEY !== 'string') {
  console.error('API key is undefined');
} else {
  const headers = {
    'x-api-key': API_KEY,
    Accept: 'application/json',
  };

  fetch('https://api.utdnebula.com/autocomplete/dag', {
    method: 'GET',
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      writeFileSync('src/data/aggregated_data.json', JSON.stringify(data));

      console.log('Aggregated data fetched.');
    });
}