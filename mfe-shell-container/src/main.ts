import { initFederation } from '@angular-architects/native-federation';
import { MfeConfig } from './app/mfe-config.model';

fetch('/assets/contents/mfe.json')
  .then(res => res.json())
  .then((config: MfeConfig) => {
    console.log("Loading MFE as: ", config)
    return initFederation(config.remotes)
      .then(() => import('./bootstrap'))
      .then(m => m.bootstrap(config));
  })
  .catch(err => console.error(err));
