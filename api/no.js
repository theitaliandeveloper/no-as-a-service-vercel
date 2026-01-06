import fs from 'fs';
import path from 'path';

// Load reasons once (cold start)
const reasonsPath = path.join(process.cwd(), 'reasons.json');
const reasons = JSON.parse(fs.readFileSync(reasonsPath, 'utf-8'));

// Simple in-memory rate limiting (best effort)
//const RATE_LIMIT = 120;
//const WINDOW_MS = 60 * 1000;
//const ipHits = new Map();

/*
function rateLimit(ip) {
  const now = Date.now();
  const data = ipHits.get(ip) || { count: 0, start: now };

  if (now - data.start > WINDOW_MS) {
    ipHits.set(ip, { count: 1, start: now });
    return true;
  }

  if (data.count >= RATE_LIMIT) return false;

  data.count++;
  ipHits.set(ip, data);
  return true;
}*/

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ip =
    req.headers['cf-connecting-ip'] ||
    req.headers['x-forwarded-for'] ||
    'unknown';

  /*if (!rateLimit(ip)) {
    return res.status(429).json({
      error: 'Too many requests, please try again later. (120 reqs/min/IP)',
    });
  }*/

  const reason = reasons[Math.floor(Math.random() * reasons.length)];
  res.status(200).json({ reason });
}
