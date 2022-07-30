## Installing wrangler 
```bash
npm i @cloudflare/wrangler -g
```

## Getting Started

Once you have installed Wrangler, spinning up and deploying your first Worker is easy!

```console
$ git clone https://github.com/top-gg/crowdin-discord
$ cd crowdin-discord

# open wrangler.toml and replace `name = "WORKER NAME"` with your Cloudflare Worker name and `account_id = "YOUR account_id"` with your accound id (can be found in workers section)
# open index.ts , go to line №7 and replace 'webook' with Discord Webhook URL

$ wrangler config
$ wrangler publish
```

## Setting it up on Crowdin

- Go to project settings
- Open API & Webhooks page 
- Add new webhook
- In the URL string put link to your Worker 
- At the end of Worker URL add `?webhook=DISCORD_WEBHOOK_URL`. where DISCORD_WEBHOOK_URL is your Discord Webhook
- Select events you need to be notified about. (Supported events: `Source string added`, `Source string updated`, `Source string deleted`)
