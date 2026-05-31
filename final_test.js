import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) envVars[key.trim()] = rest.join('=').trim();
});

const supabase = createClient(envVars['VITE_SUPABASE_URL'], envVars['VITE_SUPABASE_ANON_KEY']);

// Get a real student_id from profiles
const { data: profiles } = await supabase.from('profiles').select('id, hero_name').limit(1);
if (!profiles || profiles.length === 0) {
  console.error("No profiles found. Cannot test.");
  process.exit(1);
}

const { id: studentId, hero_name: studentName } = profiles[0];
console.log(`Using real user: ${studentName} (${studentId})`);

// Simulate exactly what saveSubmissionToCloud does
const dbSub = {
  quest_id: 103,
  student_id: studentId,
  student_name: studentName,
  status: 'approved',
  type: 'quiz',
};

console.log("Inserting:", JSON.stringify(dbSub));
const { data, error } = await supabase.from('submissions').insert([dbSub]).select();

if (error) {
  console.error("FAILED:", error.message);
} else {
  console.log("SUCCESS! Row saved to DB:");
  console.log(JSON.stringify(data[0], null, 2));
  
  // Verify the date comparison logic
  const row = data[0];
  const todayString = new Date().toLocaleDateString('en-CA');
  const submissionDateString = row.created_at
    ? new Date(row.created_at).toLocaleDateString('en-CA')
    : null;
  
  console.log(`\nDate comparison check:`);
  console.log(`  todayString:          "${todayString}"`);
  console.log(`  submissionDateString: "${submissionDateString}"`);
  console.log(`  Match: ${submissionDateString === todayString} (should be true)`);

  // Clean up
  await supabase.from('submissions').delete().eq('id', row.id);
  console.log("\n(test row cleaned up)");
}
