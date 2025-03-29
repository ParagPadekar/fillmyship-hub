
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anonymous Key. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: true,
  }
});



// new connection code


// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase URL or Anonymous Key. Please check your environment variables.');
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     persistSession: true,
//     autoRefreshToken: true,
//     detectSessionInUrl: true,
//     storage: window.localStorage, // Explicitly set storage
//   },
//   db: {
//     schema: 'public'
//   },
//   global: {
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     // Add retries for failed requests
//     fetch: (url, options) => {
//       const timeout = 30000; // 30 seconds timeout
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), timeout);

//       return fetch(url, {
//         ...options,
//         signal: controller.signal,
//       }).finally(() => clearTimeout(timeoutId));
//     }
//   },
//   realtime: {
//     params: {
//       eventsPerSecond: 10
//     }
//   },
//   // Add request timeout

// });

// let refreshTokenRetryCount = 0;
// const maxRetries = 3;

// supabase.auth.onAuthStateChange((event, session) => {
//   console.log('Auth state changed:', event, session);

//   switch (event) {
//     case 'SIGNED_OUT':
//       // Clear any cached data
//       localStorage.removeItem('supabase.auth.token');
//       refreshTokenRetryCount = 0;
//       break;

//     case 'TOKEN_REFRESHED':
//       refreshTokenRetryCount = 0;
//       break;

//     case 'USER_UPDATED':
//       // Handle user data updates
//       break;

//     case 'INITIAL_SESSION':
//       // Handle initial session load
//       break;

//     // case 'USER_DELETED':
//     //   // Clear all local data
//     //   localStorage.clear();
//     //   break;

//     default:
//       // Handle token refresh failures
//       if (!session && refreshTokenRetryCount < maxRetries) {
//         refreshTokenRetryCount++;
//         console.log(`Attempting token refresh. Attempt ${refreshTokenRetryCount} of ${maxRetries}`);

//         // Exponential backoff for retries (1s, 2s, 4s)
//         setTimeout(async () => {
//           try {
//             const { data, error } = await supabase.auth.refreshSession();
//             if (error) throw error;
//             console.log('Session refreshed successfully:', data);
//           } catch (error) {
//             console.error('Failed to refresh session:', error);
//             if (refreshTokenRetryCount === maxRetries) {
//               console.error('Max refresh retries reached. User may need to re-authenticate.');
//               // Optionally redirect to login or show a message
//               window.location.href = '/login';
//             }
//           }
//         }, Math.pow(2, refreshTokenRetryCount - 1) * 1000);
//       }
//       break;
//   }
// });

// // Optional: Add a session recovery mechanism on client initialization
// const initializeAuth = async () => {
//   try {
//     const { data: { session }, error } = await supabase.auth.getSession();
//     if (error) throw error;

//     if (!session && localStorage.getItem('supabase.auth.token')) {
//       // Session exists in localStorage but not in memory
//       await supabase.auth.refreshSession();
//     }
//   } catch (error) {
//     console.error('Error initializing auth:', error);
//   }
// };

// // Call initialization
// initializeAuth();

// // Helper function to check connection and auth status
// export const checkSupabaseConnection = async () => {
//   try {
//     // First check if we have a valid session
//     const { data: { session } } = await supabase.auth.getSession();

//     if (!session) {
//       console.warn('No valid session found');
//       return false;
//     }

//     // Then try to make a simple query
//     const { data, error } = await supabase
//       .from('listings')
//       .select('id')
//       .limit(1)
//       .maybeSingle();

//     if (error) throw error;

//     return true;
//   } catch (error) {
//     console.error('Supabase connection check failed:', error);
//     return false;
//   }
// };