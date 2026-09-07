import twilio from 'twilio'

const ALLOWED = (process.env.ALLOWED_NUMBERS || '').split(',').map(n => n.trim()).filter(Boolean)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  // Validate Twilio signature in production
  if (process.env.NODE_ENV === 'production' && process.env.TWILIO_AUTH_TOKEN) {
    const signature = req.headers['x-twilio-signature'] || ''
    const url = `${process.env.BASE_URL}/api/sms`
    if (!twilio.validateRequest(process.env.TWILIO_AUTH_TOKEN, signature, url, req.body)) {
      return res.status(403).end()
    }
  }

  const { From, Body } = req.body
  const address = Body?.trim()

  // Security: only respond to your allowed numbers
  if (ALLOWED.length > 0 && !ALLOWED.includes(From)) {
    return res.status(200).type('text/xml').send('<Response></Response>')
  }

  if (!address || address.length < 5) {
    const twiml = new twilio.twiml.MessagingResponse()
    twiml.message('Send me a property address to look up.\nExample: 123 Main St, Springfield IL 62701')
    return res.status(200).type('text/xml').send(twiml.toString())
  }

  const baseUrl = process.env.BASE_URL || `https://${req.headers.host}`

  // Fire background research — research.js responds 202 immediately
  const researchFetch = fetch(`${baseUrl}/api/research`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-key': process.env.INTERNAL_KEY || '',
    },
    body: JSON.stringify({ address, phone: From }),
  }).catch(() => null)

  // Send immediate Twilio acknowledgment
  const twiml = new twilio.twiml.MessagingResponse()
  twiml.message(`🔍 Looking up owner for:\n"${address}"\n\n⏳ Results coming in ~60 seconds...`)
  res.status(200).type('text/xml').send(twiml.toString())

  // Keep function alive until research.js has received the job
  await researchFetch
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
