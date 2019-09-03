[![npm version](https://badge.fury.io/js/transient-display-data.svg)](https://badge.fury.io/js/transient-display-data)
[![Anaconda-Server Badge](https://anaconda.org/conda-forge/jupyterlab-transient-display-data/badges/version.svg)](https://anaconda.org/conda-forge/jupyterlab-transient-display-data)

# `transient-display-data` for Jupyter Lab

This is a JupyterLab extension that allows JupyterLab to receive messages in a new
[`transient_display_data` type](https://github.com/jupyter/jupyter_client/issues/378)
and display them in the console window of the associted notebook.

As summarized [here](https://github.com/jupyter/jupyter_client/pull/378#issuecomment-386760939),
the transient display data messages are designed to send messages that are transient
in nature and will not be displayed and saved with the notebooks. Such messages
include but not limited to status or progress information for long calculations, and
debug information. This message type is identical to `display_data` in content so you
only need to use message type `transient_display_data` instead of `display_data` to
mark the message as transient.

This new message type is currently under review. However, even before it is officially
accepted, kernels can send messages of this type safely because all Jupyter clients
ignore messages of unknown types, and JupyterLab with this extension will be able to
display them. An an example, the [SoS Kernel](https://github.com/vatlab/sos-notebook)
uses this message type to send progress information during the execution of the
[SoS workflows](https://github.com/vatlab/SoS).

## How to install

* If you are using conda version of JupyterLab, you can install this extension with command
  ```bash
  conda install jupyterlab-transient-display-data -c conda-forge
  ```
* Otherwise you can install the `transient-display-data` extension using command
  ```bash
  jupyter labextension install transient-display-data
  ```
  or go to the extension manager, search for `transient-display-data`, and install.

## How to use `transient_display_data`

After you installed this extention, you can test it by

1. Create a notebook with Python 3 kernel
2. Right click and select `New Console for Notebook` to create a console window
3. Right click on the console window and you select `Show Transient Message`.
4. In the Python notebook, enter

```
kernel = get_ipython().kernel
kernel.send_response(kernel.iopub_socket,
                     'transient_display_data',
                     {
                         'data': {
                             'text/plain': 'I am transient'
                         }
                     }
                    );
```
and a message `I am transient` should be displayed in the console window.

5. If you are interested in trying [SoS Notebook](https://vatlab.github.io/sos-docs/), you can click
[this link](http://128.135.144.117:8000/hub/user-redirect/lab) to start
a JupyterLab session on our live server. You can create a new notebook
with SoS kernel, open a console window, and execute for example a trivial workflow

```
%run
[1]
[2]
[3]
```
You can see progress messages in the console window.
