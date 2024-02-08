
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zoemdcizzlyylayopyie.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZW1kY2l6emx5eWxheW9weWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDczMTEyNTQsImV4cCI6MjAyMjg4NzI1NH0.Oa5ejKe9sDTED-WQbhe4eBKk7pBSryb4QfCLmMNEkxI'
const supabase = createClient(supabaseUrl, supabaseKey)


export default supabase;