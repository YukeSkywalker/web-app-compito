const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = "https://lxylxyfgzpciwvslzgpx.supabase.co"
const supabaseKey = "sb_publishable_gChBuSZCHOjhwW1ezYAh4Q_9Md_x5Fk"

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase