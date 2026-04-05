const { setBuildAdapter, buildForFederation } = require('@softarc/native-federation/build');
const { createEsBuildAdapter } = require('@softarc/native-federation-esbuild');
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

(async () => {
  const args = new Set(process.argv);
  const isBuild = args.has('--build');

  // Configure Adapter
  const adapter = createEsBuildAdapter({
    plugins: [],
    loader: { '.tsx': 'tsx', '.ts': 'ts', '.css': 'css' }
  });

  setBuildAdapter(adapter);

  const federationConfig = require('./federation.config.js');
  const fedOptions = {
    workspaceRoot: __dirname,
    outputPath: 'dist',
    tsConfig: 'tsconfig.json',
    federationConfig: 'federation.config.js'
  };

  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  // 1. Build Federation Artifacts
  // Arg 1: Config object
  // Arg 2: Options
  // Arg 3: Externals (optional)
  const federationInfo = await buildForFederation(federationConfig, fedOptions, []);

  // 2. Build Application Bundle
  await esbuild.build({
    entryPoints: ['./src/index.tsx'],
    outfile: 'dist/main.js',
    bundle: true,
    sourcemap: true,
    minify: isBuild,
    splitting: false,
    format: 'esm',
    target: 'es2020',
    external: federationInfo.externals,
    loader: { '.tsx': 'tsx', '.ts': 'ts', '.css': 'css' },
  });

  // 3. Setup HTML
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  let indexHtml = fs.readFileSync(path.join(__dirname, 'src/index.html'), 'utf-8');

  // Inject import map
  // Note: federationInfo.importMap might be undefined if it writes it to file but doesn't return it?
  // Usually it returns it. Or we read 'dist/importmap.json'.
  // native-federation writes 'importmap.json' to outputPath.

  let importMapContent;
  try {
      importMapContent = fs.readFileSync(path.join(__dirname, 'dist/importmap.json'), 'utf-8');
  } catch (e) {
      console.warn('Could not read importmap.json');
      importMapContent = '{}';
  }

  const importMapScript = `<script type="importmap">\n${importMapContent}\n</script>`;
  indexHtml = indexHtml.replace('</head>', `${importMapScript}\n<script src="./es-module-shims.js"></script>\n</head>`);

  fs.writeFileSync(path.join(__dirname, 'dist/index.html'), indexHtml);

  // Copy es-module-shims
  if (!fs.existsSync('dist/es-module-shims.js')) {
      fs.copyFileSync(
        path.join(__dirname, 'node_modules/es-module-shims/dist/es-module-shims.js'),
        path.join(__dirname, 'dist/es-module-shims.js')
      );
  }

  if (isBuild) {
    console.log('Build complete.');
    process.exit(0);
  } else {
    // 4. Serve
    const ctx = await esbuild.context({});
    const { host, port } = await ctx.serve({
      servedir: 'dist',
      port: 3002,
    });
    console.log(`Serving at http://${host}:${port}`);
  }
})();
