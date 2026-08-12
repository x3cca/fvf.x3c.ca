# Friends vs Friends Deck Builder

[fvf.x3c.ca](https://fvf.x3c.ca/)

## Development

This project uses Node.js 22+, pnpm, React, and Vite.

```sh
pnpm install
pnpm dev
```

Run the complete local verification suite with:

```sh
pnpm check
```

Use `pnpm build-itch` to produce the relative-path itch build and `fvf-decks-itch.zip`.

## 🤝 Contributing

Refer to [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow.

The site is hosted statically with [GitHub Pages](https://pages.github.com/).

Pushes to `main` also deploy the itch build to
[cooldotty.itch.io/fvf-decks](https://cooldotty.itch.io/fvf-decks). The workflow uses the
`BUTLER_API_KEY` repository secret for authentication.

![Friends vs Friends Deck Builder](https://github.com/KarlTheCool/fvf-decks/assets/10494276/3e81ff03-aa0b-4ebe-80e2-c756c0cf927c)
