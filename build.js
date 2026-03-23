// Simple build script to bundle Speed Insights
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
const distDir = path.join(__dirname, 'js', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Bundle speed-insights.js
esbuild.build({
  entryPoints: ['js/speed-insights.js'],
  bundle: true,
  minify: true,
  format: 'iife',
  outfile: 'js/dist/speed-insights.bundle.js',
  platform: 'browser',
}).then(() => {
  console.log('✓ Speed Insights bundled successfully');
}).catch(() => {
  console.error('✗ Speed Insights bundle failed');
  process.exit(1);
});
