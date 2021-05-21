import groupBy from 'lodash/groupBy'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const WEBHOOK_PARAMETER = 'webhook'

type CrowdinEvents = 'string.added' | 'string.updated' | 'string.deleted'

const mappers: Record<CrowdinEvents, (num: number) => string> = {
  'string.added'(change: number) {
    return `Added ${change} source strings.`
  },
  'string.updated'(change: number) {
    return `Updated ${change} source strings.`
  },
  'string.deleted'(change: number) {
    return `Deleted ${change} source strings.`
  },
}

const colors: Record<CrowdinEvents, number> = {
  "string.added": 3908923,
  "string.updated": 15885602,
  "string.deleted": 16711680
}

async function handleRequest(request: Request) {
  const url = new URL(request.url)
  const res = await request.json()
  const eventsStructured = groupBy(res.events, event => event.event)

  const buildEventTally = (key: CrowdinEvents) => ({
    event: key,
    count: eventsStructured[key]?.length ?? 0,
  })

  let added = buildEventTally('string.added')
  let changed = buildEventTally('string.updated')
  let deleted = buildEventTally('string.deleted')

  const updates = [added, changed, deleted]
    .filter(val => val.count > 0)
    .map(val => mappers[val.event](val.count))

  let projectName = res.events[0].project
  let eventKeys = Object.keys(eventsStructured) as CrowdinEvents[]
  const body = JSON.stringify({
    embeds: [{
      "title": `New changes were made in ${projectName}!`,
      "description": `${updates.join('\n')}\n\n[Project Link](https://crwd.in/${projectName})`,
      "color": eventKeys.length > 1 ? colors['string.updated'] : colors[eventKeys[0]]
    }],
  })

  let discordWebhook = url.searchParams.get(WEBHOOK_PARAMETER)
  if (!discordWebhook) {
    return new Response(
      JSON.stringify({
        error: `Missing '${WEBHOOK_PARAMETER}' query parameter in request.`
      }), {status: 400}
    )
  }
  await fetch(discordWebhook, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body,
  })

  return new Response('OK', {status: 200})
}
