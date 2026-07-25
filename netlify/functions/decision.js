const fetch = require('node-fetch');

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

const WEIGHTS = {
  intercept: -1.2,
  income: 0.0008,
  age: 0.01,
  loan_amount: -0.0009,
  debt_ratio: -2.5
};

function scoreApplicant(features) {
  const linear =
    WEIGHTS.intercept +
    WEIGHTS.income * features.income +
    WEIGHTS.age * features.age +
    WEIGHTS.loan_amount * features.loan_amount +
    WEIGHTS.debt_ratio * features.debt_ratio;

  const prob = sigmoid(linear);

  const contributions = [
    { name: 'income', weight: WEIGHTS.income, value: features.income, contrib: WEIGHTS.income * features.income },
    { name: 'age', weight: WEIGHTS.age, value: features.age, contrib: WEIGHTS.age * features.age },
    { name: 'loan_amount', weight: WEIGHTS.loan_amount, value: features.loan_amount, contrib: WEIGHTS.loan_amount * features.loan_amount },
    { name: 'debt_ratio', weight: WEIGHTS.debt_ratio, value: features.debt_ratio, contrib: WEIGHTS.debt_ratio * features.debt_ratio }
  ];

  return { prob, linear, contributions };
}

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { applicant, applicantId } = body;

    const rulesTriggered = [];
    if (applicant.blacklisted) rulesTriggered.push({ id: 'R1', name: 'Blacklisted', severity: 'block' });
    if (applicant.loan_amount > applicant.income * 10) rulesTriggered.push({ id: 'R2', name: 'Loan too large vs income', severity: 'review' });
    const restrictedRegions = ['RegionX'];
    if (restrictedRegions.includes(applicant.region)) rulesTriggered.push({ id: 'R3', name: 'Restricted region', severity: 'review' });

    const { prob, contributions } = scoreApplicant({
      income: applicant.income,
      age: applicant.age,
      loan_amount: applicant.loan_amount,
      debt_ratio: applicant.debt_ratio
    });

    let decision = 'approve';
    let reason = 'Model score acceptable';
    if (rulesTriggered.some(r => r.severity === 'block')) {
      decision = 'decline';
      reason = 'Hard rule triggered';
    } else if (rulesTriggered.length > 0 && prob < 0.5) {
      decision = 'decline';
      reason = 'Rules + low model score';
    } else if (prob < 0.4) {
      decision = 'decline';
      reason = 'Low model score';
    } else if (prob < 0.6) {
      decision = 'manual_review';
      reason = 'Borderline model score';
    }

    const auditRecord = {
      applicantId,
      applicant,
      decision,
      reason,
      prob,
      contributions,
      rulesTriggered,
      timestamp: new Date().toISOString()
    };

    const auditProxyUrl = process.env.AUDIT_PROXY_URL;
    let resolvedAuditProxyUrl = null;

    if (auditProxyUrl) {
      try {
        resolvedAuditProxyUrl = new URL(auditProxyUrl).href;
      } catch {
        if (process.env.URL && auditProxyUrl.startsWith('/')) {
          resolvedAuditProxyUrl = new URL(auditProxyUrl, process.env.URL).href;
        } else {
          throw new Error('AUDIT_PROXY_URL must be an absolute URL or a root-relative path when deployed on Netlify');
        }
      }
    }

    if (resolvedAuditProxyUrl) {
      await fetch(resolvedAuditProxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(auditRecord)
      });
    } else {
      const SUPABASE_URL = process.env.SUPABASE_URL;
      const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
      if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
        throw new Error('Missing AUDIT_PROXY_URL or Supabase configuration in server environment');
      }

      const auditUrl = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/audit_logs`;
      const res = await fetch(auditUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_SERVICE_ROLE,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`
        },
        body: JSON.stringify({ payload: auditRecord, created_at: new Date().toISOString() })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Supabase insert failed: ${text}`);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ decision, reason, prob, contributions, rulesTriggered })
    };
  } catch (err) {
    console.error('Decision function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
