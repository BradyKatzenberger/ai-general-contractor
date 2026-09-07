import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const tools = [
  {
    name: 'add_recommendation',
    description: 'Add a prioritized recommendation for the general contractor to act on today',
    input_schema: {
      type: 'object',
      properties: {
        priority: { type: 'string', enum: ['HIGH', 'MED', 'LOW'], description: 'Urgency level' },
        title: { type: 'string', description: 'Short title with relevant emoji, max 60 chars' },
        desc: { type: 'string', description: 'Specific, actionable description of what to do and why' },
      },
      required: ['priority', 'title', 'desc'],
    },
  },
]

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { schedule = [], logText = '' } = req.body

  const delayedTasks = schedule.filter(t => t.status === 'delay').map(t => t.task)
  const waitingTasks = schedule.filter(t => t.status === 'waiting').map(t => t.task)

  const userMessage = `Analyze this construction project and generate 4-6 prioritized recommendations using the add_recommendation tool.

PROJECT: Monroe Apartments Phase 1 | Monroe, WI | $4.2M budget
STATUS: 34% complete | Day 107 of 198 | 8 days behind schedule

SCHEDULE:
${schedule.map(s => `- ${s.task} (${s.trade}): ${s.pct}% - ${s.status.toUpperCase()}`).join('\n')}

DELAYED: ${delayedTasks.join(', ') || 'None'}
WAITING ON DELAYED: ${waitingTasks.join(', ') || 'None'}

TODAY'S SITE LOG:
${logText}

DATE: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Call add_recommendation for each action. Be specific about WHAT to do and WHY it matters today.`

  try {
    const recommendations = []
    const messages = [{ role: 'user', content: userMessage }]
    let iterations = 0

    while (iterations++ < 20) {
      const response = await client.messages.create({
        model: 'claude-opus-5',
        max_tokens: 2048,
        system: 'You are an expert AI construction superintendent. Analyze real project data and generate precise, actionable recommendations using the add_recommendation tool. Focus on what needs to happen TODAY to keep the project on track.',
        tools,
        messages,
      })

      messages.push({ role: 'assistant', content: response.content })

      if (response.stop_reason === 'end_turn') break

      const toolUses = response.content.filter(b => b.type === 'tool_use')
      if (!toolUses.length) break

      const toolResults = []
      for (const tu of toolUses) {
        if (tu.name === 'add_recommendation') {
          const { priority, title, desc } = tu.input
          recommendations.push({
            priority,
            pcolor: priority === 'HIGH' ? 'var(--danger)' : priority === 'MED' ? 'var(--warn)' : 'var(--ok)',
            title,
            desc,
          })
          toolResults.push({ type: 'tool_result', tool_use_id: tu.id, content: 'Added.' })
        }
      }
      messages.push({ role: 'user', content: toolResults })
    }

    res.json({ recommendations })
  } catch (err) {
    console.error('Agent error:', err)
    res.status(500).json({ error: err.message })
  }
}
