import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://otrbpylisdastirfpjjs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cmJweWxpc2Rhc3RpcmZwampzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MDI5NjgsImV4cCI6MjA4OTQ3ODk2OH0.WRQA4WXS4fV4esB0SDN9nRdtNCbRkTk_NfGKVq63rJk'
export const supabase = createClient(supabaseUrl, supabaseKey)