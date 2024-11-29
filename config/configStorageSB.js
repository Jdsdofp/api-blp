const { createClient } = require('@supabase/supabase-js');

const supabaseUrl ='https://nkxsocytllzusgpiydel.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5reHNvY3l0bGx6dXNncGl5ZGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk3MDkzNTMsImV4cCI6MjAzNTI4NTM1M30.W92ptzt4WfqnXX_1tz2BxDe7ZZmjGd4avrDizXQf8yI';
const supabase = createClient(supabaseUrl, supabaseKey);

// Certifique-se de usar o bucket correto
const bucket = supabase.storage.from('blpdocs');

module.exports = supabase;

