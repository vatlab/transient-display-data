// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import {
  CodeConsole,
  ConsolePanel,
  IConsoleTracker
} from '@jupyterlab/console';

import {
    TransientHandler
} from './transient';

import { AttachedProperty } from '@lumino/properties';

import { ReadonlyPartialJSONObject } from '@lumino/coreutils';

/**
 * The console widget tracker provider.
 */
export const transient: JupyterFrontEndPlugin<void> = {
  id: 'vatlab/jupyterlab-extension:transient',
  requires: [IConsoleTracker],
  optional: [ICommandPalette],
  activate: activateTransient,
  autoStart: true
};

export default transient;

function activateTransient(
  app: JupyterFrontEnd,
  tracker: IConsoleTracker,
  palette: ICommandPalette | null
) {
  const { shell } = app;
  tracker.widgetAdded.connect((sender, widget) => {
    const console = widget.console;

    const handler = new TransientHandler({
      sessionContext: console.sessionContext,
      parent: console
    });
    Private.transientHandlerProperty.set(console, handler);
    console.disposed.connect(() => {
      handler.dispose();
    });
  });

  const { commands } = app;
  const category = 'Console';
  const toggleShowTransientMessage = 'console:toggle-show-transient-message';

  // Get the current widget and activate unless the args specify otherwise.
  function getCurrent(args: ReadonlyPartialJSONObject): ConsolePanel | null {
    let widget = tracker.currentWidget;
    let activate = args['activate'] !== false;
    if (activate && widget) {
      shell.activateById(widget.id);
    }
    return widget;
  }

  commands.addCommand(toggleShowTransientMessage, {
    label: args => 'Show Transient Messages',
    execute: args => {
      let current = getCurrent(args);
      if (!current) {
        return;
      }
      const handler = Private.transientHandlerProperty.get(current.console);
      if (handler) {
        handler.enabled = !handler.enabled;
      }
    },
    isToggled: () =>
      tracker.currentWidget !== null &&
      !! Private.transientHandlerProperty.get(tracker.currentWidget.console)?.enabled,
    isEnabled: () =>
      tracker.currentWidget !== null &&
      tracker.currentWidget === shell.currentWidget
  });

  if (palette) {
    palette.addItem({
      command: toggleShowTransientMessage,
      category,
      args: { isPalette: true }
    });
  }

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