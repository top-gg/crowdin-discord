import groupBy from 'lodash/groupBy'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request: Request) {
  const url = new URL(request.url)
  const res = await request.json()
  const eventsStructured = groupBy(res.events, event => event.event)
  const stringAddAmount = 'string.added' in eventsStructured ? eventsStructured['string.added'].length : 0;
  const stringChangeAmount = 'string.updated' in eventsStructured ? eventsStructured['string.updated'].length : 0;
  const stringDeleteAmount = 'string.deleted' in eventsStructured ? eventsStructured['string.deleted'].length : 0;
  const body = JSON.stringify({
    content: `New changes were made in project!\n${stringAddAmount} lines added.\n${stringChangeAmount} lines changed.\n${stringDeleteAmount} lines deleted.`
  })

  let discordWebhook = url.searchParams.get('webhook_link')
  await fetch(discordWebhook, {
    method: "POST",
    headers: { 'Content-type': 'application/json' },
    body
  })

  return new Response('OK')
}
