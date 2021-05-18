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
    return `Deleted ${change} source strings`
  },
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

  const body = JSON.stringify({
    content: `New changes were made in project!\n${updates.join('\n')}`,
  })

  let discordWebhook = url.searchParams.get(WEBHOOK_PARAMETER)
  if (!discordWebhook) {
    return new Response(
      JSON.stringify({
        error: `Missing "${WEBHOOK_PARAMETER}" query parameter in request.`,
      }),
    )
  }
  await fetch(discordWebhook, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body,
  })

  return new Response('OK')
}
