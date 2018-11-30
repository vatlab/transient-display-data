import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the transient-display-message extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'transient-display-message',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension transient-display-message is activated!');
  }
};

export default extension;
