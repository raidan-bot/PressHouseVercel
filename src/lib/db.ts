// Modern Independent Local Database Fallback Wrapper
// Built to ensure 100% autonomy and eliminate external third-party cloud dependencies.

export const supabase = {
  auth: {
    signInWithOAuth: async (options: any) => {
      console.warn("External third-party OAuth requires cloud keys. Redirecting to local fallback.");
      return { 
        data: null, 
        error: new Error('External identity provider services are not configured in local independent mode.') 
      };
    },
    getSession: async () => {
      return { data: { session: null }, error: null };
    }
  },
  from: (table: string) => {
    return {
      select: (fields?: string) => {
        console.warn(`Local Mode: Direct access to table '${table}' via Supabase disabled. Falling back to local Express SQL Server APIs.`);
        return Promise.resolve({ 
          data: null, 
          error: new Error(`Table fallback initiated for: ${table}`) 
        });
      }
    };
  },
  storage: {
    from: (bucket: string) => {
      return {
        upload: async (path: string, file: any, options?: any) => {
          return { 
            data: null, 
            error: new Error('Cloud-delivered object storage is disabled. Please use standard local upload instead.') 
          };
        },
        getPublicUrl: (path: string) => {
          return { data: { publicUrl: `/uploads/${path}` } };
        }
      };
    }
  }
};
