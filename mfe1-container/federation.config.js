const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'mfe1-container',



  exposes: {
    './Component': './src/app/app.component.ts',
    './routes': './src/app/app.routes.ts',
    './Viewer': './src/app/viewer/viewer.ts',
    './JsonShow': './src/app/json-show/json-show.ts',
    './JsonShowWrapper': './src/app/json-show/json-show-wrapper.ts',
    './MermaidShow': './src/app/mermaid-show/mermaid-show.ts',
    './MermaidShowWrapper': './src/app/mermaid-show/mermaid-show-wrapper.ts',
    './DataShow': './src/app/data-show/data-show.ts',
    './DataShowWrapper': './src/app/data-show/data-show-wrapper.ts',
    './MarkdownShow': './src/app/markdown-show/markdown-show.ts',
    './MarkdownShowWrapper': './src/app/markdown-show/markdown-show-wrapper.ts',
    './TextShow': './src/app/text-show/text-show.ts',
    './TextShowWrapper': './src/app/text-show/text-show-wrapper.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: false, requiredVersion: 'auto' }),
    '@polecatworks/mfe-shared': { singleton: true, strictVersion: false }
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket'
    // Add further packages you don't need at runtime
  ],

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0

  features: {
    // New feature for more performance and avoiding
    // issues with node libs. Comment this out to
    // get the traditional behavior:
    ignoreUnusedDeps: true
  }
});
