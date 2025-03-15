// api/submit-form.js
import { Resend } from 'resend';

// Create rate limiter function
const rateLimit = (interval) => {
  const cache = new Map();
  return (ip) => {
    const now = Date.now();
    if (!cache.has(ip)) {
      cache.set(ip, [now]);
      return true;
    }

    // Get timestamps and filter out expired ones
    let timestamps = cache.get(ip);
    timestamps = timestamps.filter(time => time > now - interval);

    // Check if too many requests
    if (timestamps.length >= 5) { // 5 requests per interval
      return false;
    }

    // Add current timestamp
    timestamps.push(now);
    cache.set(ip, timestamps);
    return true;
  };
};

// Initialize rate limiter (60 seconds interval)
const checkRateLimit = rateLimit(60 * 1000);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get client IP for rate limiting
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Check rate limit
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  try {
    const { name, email, message, website } = req.body;

    // Spam protection - honeypot check
    if (website) {
      // Silent success for bots
      return res.status(200).json({ success: true });
    }

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      reply_to: email, // This sets the reply-to address to the form submitter's email
      to: process.env.TO_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>To reply directly to this person, simply hit reply in your email client.</p>
      `
    });

    if (error) {
      console.error('Resend API error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    console.error('Form submission error:', error);
    return res.status(500).json({ error: 'Form submission failed' });
  }
}