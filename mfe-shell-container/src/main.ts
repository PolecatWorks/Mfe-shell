import { initFederation } from '@angular-architects/native-federation';


fetch('/assets/contents/shell-config.json')
  .then(res => res.json())
  .then(config => {
<<<<<<< HEAD
    console.log("Loading MFE config: ", config)
    return initFederation(config.mfes)
=======
    console.log("Loading MFE as: ", config)
    return initFederation(config.remotes)
      .then(() => config);
>>>>>>> 39d378d (Make MFE Shell configurable via JSON)
  })
  .catch(err => console.error(err))
  .then(config => import('./bootstrap').then(m => m.default(config)))
  .catch(err => console.error(err))
