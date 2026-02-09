import { initFederation } from '@angular-architects/native-federation';

fetch('/assets/contents/mfe.json')
  .then((res) => res.json())
  .then((config) => initFederation(config))
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));
