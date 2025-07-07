import supabase from '../supabase';

export const logActivity = async ({ action, table, vessel, details, id }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        const user = session.user;
        if (!user) return;

        await supabase.from('activity_logs').insert({
            company_id: id,
            user_name: user.user_metadata.fullName,
            action,
            vessel: vessel,
            email: user.email,
            table_name: table,
            details
        });
    }
};

export const getActivityLogs = async () => {
    const { data: { session } } = await supabase.auth.getSession();
  
    if (!session) return [];
  
    const user = session.user;
  
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();
  
    if (profileError || !profile) return [];
  
    const companyId = profile.company_id;
  
    const { data: logs, error: logError } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('company_id', companyId)
      .order('timestamp', { ascending: false });
  
    if (logError) {
      console.error('Log fetch error:', logError.message);
      return [];
    }
  
    return logs;
  };
  


