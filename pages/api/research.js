import twilio from 'twilio'
import { runResearch } from '../../lib/researcher'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  // Validate internal key — only sms.js should call this
  if (req.headers['x-internal-key'] !== process.env.INTERNAL_KEY) {
    return res.status(403).end()
  }

  const { address, phone } = req.body
  if (!address || !phone) return res.status(400).end()

  // Respond immediately so sms.js can exit — this function continues running
  res.status(202).json({ status: 'researching' })

  const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

  try {
    const result = await runResearch(address)
    await twilioClient.messages.create({
      body: result,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    })
  } catch (err) {
    console.error('Research error:', err)
    await twilioClient.messages.create({
      body: `❌ Lookup failed for:\n"${address}"\n\nError: ${err.message.slice(0, 200)}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    }).catch(() => {})
  }
}
