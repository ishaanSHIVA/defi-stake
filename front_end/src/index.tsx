import React from 'react';
import ReactDOM from 'react-dom/client';
import { App} from './App'


import { DAppProvider ,ChainId } from "@usedapp/core"
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
<DAppProvider config={{
      supportedChains: [ChainId.Kovan],
}}>
  <App />
</DAppProvider>
);

