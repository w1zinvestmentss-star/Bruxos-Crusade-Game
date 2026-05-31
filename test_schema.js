import fs from 'fs';

// Read .env.local to get Supabase URL and ANON KEY
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['VITE_SUPABASE_ANON_KEY'];

async function test() {
  const res = await fetch(`${supabaseUrl}/rest/v1/submissions`, {
    method: 'OPTIONS',
    headers: {
      'apikey': supabaseKey,
      'Accept': 'application/json'
    }
  });
  console.log(res.headers.get('allow'));
  // Or fetch OpenAPI spec again but with the right path? The OpenAPI spec is at /rest/v1/?apikey=...
  const res2 = await fetch(`${supabaseUrl}/rest/v1/`, {
    headers: {
      'apikey': supabaseKey
    }
  });
  const data = await res2.json();
  // print the schema for submissions
  if (data && data.definitions && data.definitions.submissions) {
    console.log(Object.keys(data.definitions.submissions.properties));
  } else {
    console.log("No definitions found");
  }
}

test();
