import groupBy from 'lodash/groupBy'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request: Request) {
  const url = new URL(request.url)
  const res = await request.json()
  const eventsStructured = groupBy(res.events, event => event.event)
  let query = request.query
  let stringAddAmount; if (eventsStructured.hasOwnProperty('string.added')) {stringAddAmount = JSON.stringify(eventsStructured["string.added"].length)} else {stringAddAmount = 0}
  let stringChangeAmount; if (eventsStructured.hasOwnProperty('string.updated')) {stringChangeAmount = JSON.stringify(eventsStructured["string.updated"].length)} else {stringChangeAmount = 0}
  let stringDeleteAmount; if (eventsStructured.hasOwnProperty('string.deleted')) {stringDeleteAmount = JSON.stringify(eventsStructured["string.deleted"].length)} else {stringDeleteAmount = 0}
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
