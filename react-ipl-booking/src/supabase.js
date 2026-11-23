
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kptdhpwtvzdchkpsgdft.supabase.co";

const supabaseKey = "sb_publishable__S_epSCuMqIuoqNj-RhfwA_PnkYwa_K";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
