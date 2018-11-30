# transient-message

An extension that allows kernels to send [`transient_display_data` messages
type](https://github.com/jupyter/jupyter_client/issues/378) (under review)
to be displayed **not in notebooks**, but in associated console windows of notebooks. In particular,

1. kernels can send `transient_display_data` during the evaluation of the
  cells. Typical examples of such messages include debug information and
  progress information that are meant to be informative (for long
  computations) but not saved in the notebook.

2. The message has the same format as `display_data`, which essentially has
  a `data` field with MIME content (e.g. `text/plain` or `text/html`).

3. JLab (and other frontend) will simple ignore this message type.

4. With this extension, the messages will be displayed in the console
   window of notebooks. A menu item "Show Transient Message" can be used
   to disable the display of such messages.
