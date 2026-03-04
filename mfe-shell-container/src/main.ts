import { initFederation } from '@angular-architects/native-federation';


fetch('/assets/contents/shell-config.json')
  .then(res => res.json())
  .then(config => {
    console.log("Loading MFE config: ", config)
    return initFederation(config.mfes)
  })
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err))
