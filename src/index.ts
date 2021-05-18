import groupBy from 'lodash/groupBy'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request: Request) {
  const url = new URL(request.url)
  const res = await request.json()
  const eventsStructured = groupBy(res.events, event => event.event)

  const stringAdded = eventsStrctures['string.added']?.length || 0
  const stringUpdated = eventsStrctures['string.updated']?.length || 0
  const stringDeleted = eventsStrctures['string.deleted']?.length || 0

  const discordWebhook = url.searchParams.get('webhook_link')
  await fetch(discordWebhook, {
    method: "POST",
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({
      content: 
        `New changes were made in project!\n` +
        `${stringAdded} lines added.\n` +
        `${stringUpdated} lines changed.\n`
        `${stringDeleted} lines deleted.`
    })
  })

  return new Response('OK')
}
