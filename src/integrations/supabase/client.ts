// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://daidjsvglwlssomyhkyc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhaWRqc3ZnbHdsc3NvbXloa3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjQxMzIsImV4cCI6MjA2MjMwMDEzMn0.adYi3ZWN0qHkQhuvSuBax8iYD3aQC0gQ9PUABWOuuIg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);