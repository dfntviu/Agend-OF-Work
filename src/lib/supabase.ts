import { createClient } from "@supabase/supabase-js";
import type {Database} from "../types/database"

    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY

    /**  console.log("URL:", url);
        console.log("KEY:", key);*/
    
    export const supabase = createClient <Database>(url,key);