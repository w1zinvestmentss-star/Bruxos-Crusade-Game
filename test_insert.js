import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import crypto from 'crypto';

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
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const dbSub = {
    quest_id: 101,
    student_id: crypto.randomUUID(),
    student_name: 'test',
    status: 'pending',
    type: 'upload'
  };
  console.log("Trying to insert with crypto UUID...");
  const { data, error } = await supabase.from('submissions').insert([dbSub]).select();
  if (error) {
    console.error("Error inserting:", error);
  } else {
    console.log("Successfully inserted!", data);
  }
}

test();
