# Vercel Speed Insights Setup

This project uses Vercel Speed Insights to track real-world performance metrics.

## Installation

The `@vercel/speed-insights` package is already installed and configured.

## Build Process

To rebuild the Speed Insights bundle:

```bash
npm run build
```

This will:
1. Bundle the Speed Insights initialization code
2. Output to `js/dist/speed-insights.bundle.js`
3. This file is included in `index.html` and committed to the repository

## How It Works

1. **Package**: `@vercel/speed-insights` is installed as a dependency
2. **Source**: `js/speed-insights.js` contains the initialization code
3. **Build**: `build.js` uses esbuild to bundle the source into a browser-ready file
4. **Integration**: The bundled script is included in `index.html` before the closing `</body>` tag

## Deployment

When deployed to Vercel:
- Speed Insights will automatically start collecting performance data
- No additional configuration is needed in the Vercel dashboard
- Data will be available in the Vercel Analytics dashboard after deployment

## Files

- `js/speed-insights.js` - Source file with Speed Insights initialization
- `js/dist/speed-insights.bundle.js` - Bundled, minified output (committed)
- `build.js` - Build script for bundling
- `package.json` - Contains dependencies and build script

## Maintenance

If the Speed Insights package is updated:
1. Run `npm update @vercel/speed-insights`
2. Run `npm run build` to rebuild the bundle
3. Commit the updated `package-lock.json` and `js/dist/speed-insights.bundle.js`
