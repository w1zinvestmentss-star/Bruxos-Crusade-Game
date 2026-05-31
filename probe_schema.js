import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import crypto from 'crypto';

const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) envVars[key.trim()] = rest.join('=').trim();
});

const supabase = createClient(envVars['VITE_SUPABASE_URL'], envVars['VITE_SUPABASE_ANON_KEY']);

const studentId = crypto.randomUUID();

// Known NOT NULL: student_name, type
const tests = [
  // Test 1: minimal required fields
  { quest_id: 101, student_id: studentId, student_name: 'TestHero', status: 'pending', type: 'quiz' },
];

for (let i = 0; i < tests.length; i++) {
  console.log(`\n--- Test ${i + 1}:`, JSON.stringify(tests[i]));
  const { data, error } = await supabase.from('submissions').insert([tests[i]]).select();
  if (error) {
    console.error(`  FAILED:`, error.message);
  } else {
    console.log(`  SUCCESS! Full returned row (reveals ALL columns):`);
    console.log(JSON.stringify(data[0], null, 2));
    await supabase.from('submissions').delete().eq('id', data[0].id);
    console.log(`  (cleaned up)`);
  }
}
