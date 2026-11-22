import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .then(() => import('./bootstrap'))
  .then((m) => m.default())
  .catch((err) => {
    console.error('Failed to bootstrap mfe1:', err);
  });
