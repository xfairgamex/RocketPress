# RocketPress
fully automate the order, print, press, and ship workflow for direct-to-film (DTF) print shops, particularly those using Shopify. AutoDTF integrates with Shopify and suppliers like S&amp;S Activewear to create an efficient, minimal-touch system that reduces human error and boosts throughput.

## Development

Install dependencies and run the tests:

```bash
npm install
npm test
```

## Building

Compile the TypeScript source to the `dist` directory:

```bash
npm run build
```

## Deployment

The project defines a `prepare` script so `npm install` automatically compiles the TypeScript. Platforms such as Render that only run `npm install` during the build step will therefore generate the `dist` files automatically. Start the service with:

```bash
node dist/index.js
```

See `.env.example` for the required environment variables.
