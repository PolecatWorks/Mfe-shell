import { initFederation } from '@angular-architects/native-federation';


fetch('/assets/contents/shell-config.json')
  .then(res => res.json())
  .then(config => {
    return initFederation(config.remotes)
      .then(() => config);
  })
  .catch(err => console.error(err))
  .then(config => import('./bootstrap').then(m => m.default(config)))
  .catch(err => console.error(err))
