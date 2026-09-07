import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function runResearch(address) {
  const stream = client.messages.stream({
    model: 'claude-opus-5',
    max_tokens: 4096,
    tools: [
      { type: 'web_search_20260209', name: 'web_search', max_uses: 12 },
      { type: 'web_fetch_20260209', name: 'web_fetch', max_uses: 8 },
    ],
    system: `You are a property research assistant for a real estate investor doing skip tracing on their own investment deals.

Given a property address, find the owner's contact information from public records by following these steps:

STEP 1 — PROPERTY TAX RECORDS
Search: "[county] county [state] assessor property search" or "[city] [state] property tax lookup"
Look up the property and extract: owner name, owner mailing address, parcel ID/APN

STEP 2 — IF OWNER IS AN ENTITY (LLC, LP, Corp, Inc, Trust, Holdings, etc.)
Search: "[entity name] [state] secretary of state registered agent"
Go to that state's SOS business search (e.g. wdfi.org for WI, ilsos.gov for IL)
Find the registered agent or organizer — that's the real person

STEP 3 — PHONE NUMBER
Search "[person's full name] [city] [state]" on people search sites
Check TruePeopleSearch.com or FastPeopleSearch.com
Pick the best match based on location

FORMAT your final response EXACTLY like this — no other text:

📍 PROPERTY: [full address]
👤 OWNER OF RECORD: [name from tax records]
🏠 OWNER MAILING ADDRESS: [mailing address from tax records]
🏢 ENTITY: [LLC/Corp name, or "Direct owner — individual"]
👤 CONTACT PERSON: [real person's name — direct owner or person behind entity]
📞 PHONE: [best number found, or "Not found in public records"]
📋 SOURCE: [e.g., "Dane County Assessor + WI SOS + TruePeopleSearch"]`,
    messages: [{
      role: 'user',
      content: `Research the property owner for this address: ${address}`,
    }],
  })

  const response = await stream.finalMessage()
  const textBlock = response.content.find(b => b.type === 'text')

  if (textBlock?.text) return textBlock.text

  return `❌ Could not find owner information for: ${address}\n\nTry including the full address with city and state (e.g., "123 Main St, Springfield IL 62701").`
}
