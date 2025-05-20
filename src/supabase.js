import { createClient } from '@supabase/supabase-js'
const supabase = createClient(import.meta.env.VITE_APP_URL, import.meta.env.VITE_APP_TOKEN)

export default supabase