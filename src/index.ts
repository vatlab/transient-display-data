// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { JupyterLabPlugin, JupyterLab } from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import {
  CodeConsole,
  ConsolePanel,
  IConsoleTracker
} from '@jupyterlab/console';

import {
  TransientHandler
} from './transient';

import { AttachedProperty } from '@phosphor/properties';

import { ReadonlyJSONObject } from '@phosphor/coreutils';

/**
 * The console widget tracker provider.
 */
export const transient: JupyterLabPlugin<void> = {
  id: '@jupyterlab/console-extension:transient',
  requires: [IConsoleTracker, ICommandPalette],
  activate: activateTransient,
  autoStart: true
};

export default transient;

function activateTransient(
  app: JupyterLab,
  tracker: IConsoleTracker,
  palette: ICommandPalette
) {
  tracker.widgetAdded.connect((sender, panel) => {
    const console = panel.console;

    const handler = new TransientHandler({
      session: console.session,
      parent: console
    });
    Private.transientHandlerProperty.set(console, handler);
    console.disposed.connect(() => {
      handler.dispose();
    });
  });

  const { commands, shell } = app;
  const category = 'Console';
  const toggleShowTransientMessage = 'console:toggle-show-transient-message';

  // Get the current widget and activate unless the args specify otherwise.
  function getCurrent(args: ReadonlyJSONObject): ConsolePanel | null {
    let widget = tracker.currentWidget;
    let activate = args['activate'] !== false;
    if (activate && widget) {
      shell.activateById(widget.id);
    }
    return widget;
  }

  commands.addCommand(toggleShowTransientMessage, {
    label: args => 'Show Transient Message',
    execute: args => {
      let current = getCurrent(args);
      if (!current) {
        return;
      }
      const handler = Private.transientHandlerProperty.get(current.console);
      handler.enabled = !handler.enabled;
    },
    isToggled: () =>
      tracker.currentWidget !== null &&
      Private.transientHandlerProperty.get(tracker.currentWidget.console).enabled,
    isEnabled: () =>
      tracker.currentWidget !== null &&
      tracker.currentWidget === app.shell.currentWidget
  });

  palette.addItem({
    command: toggleShowTransientMessage,
    category,
    args: { isPalette: true }
  });

  app.contextMenu.addItem({
    command: toggleShowTransientMessage,
    selector: '.jp-CodeConsole'
  });
}

/*
 * A namespace for private data.
 */
namespace Private {
  /**
   * An attached property for a console's transient handler.
   */
  export const transientHandlerProperty = new AttachedProperty<
    CodeConsole,
    TransientHandler | undefined
  >({
    name: 'transientHandler',
    create: () => undefined
  });
}
