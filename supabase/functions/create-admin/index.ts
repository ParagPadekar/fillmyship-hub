
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.26.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase URL or service role key');
    }

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Admin credentials
    const adminEmail = 'admin@fillmyship.com';
    const adminPassword = 'Admin@123456';
    const adminUsername = 'ShipAdmin';

    // Check if admin user already exists
    const { data: existingUsers, error: searchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', adminUsername);

    if (searchError) {
      throw searchError;
    }

    if (existingUsers && existingUsers.length > 0) {
      return new Response(
        JSON.stringify({ 
          message: 'Admin user already exists', 
          adminEmail, 
          adminPassword 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 200 
        }
      );
    }

    // Create admin user
    const { data: authData, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        username: adminUsername,
        role: 'admin'
      }
    });

    if (createError) {
      throw createError;
    }

    console.log('Admin user created successfully');

    return new Response(
      JSON.stringify({ 
        message: 'Admin user created successfully', 
        adminEmail, 
        adminPassword 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error creating admin user:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create admin user' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
