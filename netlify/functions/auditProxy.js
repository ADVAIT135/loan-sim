const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const record = JSON.parse(event.body);
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/audit_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_ROLE,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`
      },
      body: JSON.stringify({ payload: record, created_at: new Date().toISOString() })
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: 500, body: `Supabase insert failed: ${text}` };
    }

    return { statusCode: 200, body: JSON.stringify({ status: 'ok' }) };
  } catch (err) {
    return { statusCode: 500, body: `Error: ${err.message}` };
  }
};
