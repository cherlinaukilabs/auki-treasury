// netlify/functions/auth.js
// Password stored in Netlify environment variable AUKI_PASSWORD
const crypto = require('crypto');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const { password } = JSON.parse(event.body || '{}');
  const correct = process.env.AUKI_PASSWORD;

  if (!password || !correct) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing credentials' }) };
  }

  // Timing-safe comparison to prevent timing attacks
  const a = crypto.createHash('sha256').update(password).digest('hex');
  const b = crypto.createHash('sha256').update(correct).digest('hex');
  const ok = crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

  if (!ok) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Incorrect password' }) };
  }

  // Return a session token
  const token = crypto.randomBytes(32).toString('hex');
  return {
    statusCode: 200,
    body: JSON.stringify({ token }),
  };
};
