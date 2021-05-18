import groupBy from 'lodash/groupBy'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request: Request) {
  const url = new URL(request.url)
  let project
  if (url.pathname == '/backend' || request.method == 'POST') {
    project = 'https://crwd.in/topgg-entities'
  } else if (url.pathname == '/main' || request.method == 'POST') {
    project = 'https://crwd.in/topgg'
  }

  const body = JSON.stringify({
    content: `New lines were added!\n${project}`,
  })

  return new Response('OK')
}
