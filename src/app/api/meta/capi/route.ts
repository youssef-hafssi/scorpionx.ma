import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Meta Conversions API - server-side Purchase event
// Deduplicates with the browser Pixel event via a shared event_id (the order id)
const META_DATASET_ID = process.env.META_DATASET_ID;
const META_CONVERSIONS_API_TOKEN = process.env.META_CONVERSIONS_API_TOKEN;

function hash(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

// Normalizes Moroccan numbers to E.164 digits (no +) before hashing, per Meta's requirements
function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    digits = '212' + digits.slice(1);
  } else if (!digits.startsWith('212')) {
    digits = '212' + digits;
  }
  return digits;
}

export async function POST(request: NextRequest) {
  if (!META_DATASET_ID || !META_CONVERSIONS_API_TOKEN) {
    console.error('Meta Conversions API not configured: missing META_DATASET_ID or META_CONVERSIONS_API_TOKEN');
    return NextResponse.json({ skipped: true }, { status: 200 });
  }

  try {
    const body = await request.json();
    const { eventId, value, currency, email, phone, fbp, fbc, eventSourceUrl } = body;

    if (!eventId || value === undefined) {
      return NextResponse.json({ error: 'Missing eventId or value' }, { status: 400 });
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

    const userData: Record<string, unknown> = {};
    if (email) userData.em = [hash(email)];
    if (phone) userData.ph = [hash(normalizePhone(phone))];
    if (clientIp) userData.client_ip_address = clientIp;
    if (userAgent) userData.client_user_agent = userAgent;
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    const payload = {
      data: [
        {
          event_name: 'Purchase',
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: 'website',
          event_source_url: eventSourceUrl,
          user_data: userData,
          custom_data: {
            value,
            currency: currency || 'MAD',
          },
        },
      ],
    };

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${META_DATASET_ID}/events?access_token=${META_CONVERSIONS_API_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Meta Conversions API error:', result);
      return NextResponse.json({ error: result }, { status: 502 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error sending Meta Purchase event:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
