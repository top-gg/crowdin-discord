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
# open index.js , go to line №18 and replace 'DISCORD WEBHOOK URL' with Discord Webhook URL

$ wrangler config
$ wrangler publish
```