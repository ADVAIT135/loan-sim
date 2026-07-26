const http = require('http');
const path = require('path');

process.env.AUDIT_PROXY_URL = 'http://localhost:9000/';

const decisionModule = require('../netlify/functions/decision.js');

const applicant = {
  id: 'smoke-1',
  income: 50000,
  age: 30,
  loan_amount: 30000,
  debt_ratio: 0.2,
  blacklisted: false,
  region: 'RegionA'
};

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    console.log('Audit proxy received:', body.slice(0, 200));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
  });
});

server.listen(9000, async () => {
  console.log('Temporary audit proxy listening on :9000');
  const event = {
    httpMethod: 'POST',
    body: JSON.stringify({ applicant, applicantId: applicant.id })
  };

  try {
    const result = await decisionModule.handler(event);
    console.log('Decision function result:', result);
  } catch (err) {
    console.error('Decision function threw:', err);
  } finally {
    server.close();
  }
});
