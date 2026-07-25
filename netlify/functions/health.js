exports.handler = async function(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const auditProxyUrl = process.env.AUDIT_PROXY_URL;
  let auditProxyUrlIsAbsolute = null;
  if (auditProxyUrl) {
    try {
      new URL(auditProxyUrl);
      auditProxyUrlIsAbsolute = true;
    } catch {
      auditProxyUrlIsAbsolute = false;
    }
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;
  const supabaseConfigured = Boolean(supabaseUrl && supabaseServiceRole);

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'ok',
      auditProxyUrl: Boolean(auditProxyUrl),
      auditProxyUrlIsAbsolute,
      supabaseConfigured,
      ready: Boolean(auditProxyUrl || supabaseConfigured)
    })
  };
};
