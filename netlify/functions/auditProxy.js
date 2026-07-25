const fetch = require('node-fetch');

exports.handler = async function(event) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE in environment' })
    };
  }

  const headers = {
    'Content-Type': 'application/json',
    apikey: SUPABASE_SERVICE_ROLE,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`
  };

  if (event.httpMethod === 'POST') {
    try {
      const record = JSON.parse(event.body);
      const res = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/audit_logs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ payload: record, created_at: new Date().toISOString() })
      });

      if (!res.ok) {
        const text = await res.text();
        return { statusCode: 500, body: JSON.stringify({ error: `Supabase insert failed: ${text}` }) };
      }

      return { statusCode: 200, body: JSON.stringify({ status: 'ok' }) };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
  }

  if (event.httpMethod === 'GET') {
    try {
      const params = event.queryStringParameters || {};
      const limit = Number(params.limit || '20');
      const offset = Number(params.offset || '0');

      const res = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/audit_logs?select=*&order=created_at.desc&limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers
      });

      if (!res.ok) {
        const text = await res.text();
        return { statusCode: 500, body: JSON.stringify({ error: `Supabase select failed: ${text}` }) };
      }

      const data = await res.json();
      return { statusCode: 200, body: JSON.stringify({ data }) };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
  }

  return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
};
