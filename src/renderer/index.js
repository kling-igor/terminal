// import React from "react";
// import { render } from "react-dom";
// import App from "./app";
// import { Provider } from "mobx-react";

// import rootStore from "./rootstore";

// render(
//   <Provider store={rootStore}>
//     <App />
//   </Provider>,
//   document.getElementById("app")
// );

// https://github.com/Microsoft/node-pty/blob/master/examples/electron/renderer.js
// https://github.com/Microsoft/node-pty/tree/master/examples/electron

// https://github.com/Microsoft/node-pty/issues/234
// https://github.com/Microsoft/node-pty/issues/55

{
  /* <link rel="Stylesheet" href="./node_modules/xterm/lib/xterm.css"></link> */
}

// https://github.com/princjef/xterm-electron-sample

// https://www.christianengvall.se/electron-localization/
// https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e
// https://medium.com/@ajmeyghani/javascript-bundlers-a-comparison-e63f01f2a364

// https://stackoverflow.com/questions/15957529/can-i-install-a-npm-package-from-javascript-running-in-node-js

// programmatic npm package and metadata downloader
// https://github.com/zkat/pacote

// Plugin manager and installer for Node.JS
// https://github.com/davideicardi/live-plugin-manager

import * as os from "os";
import * as pty from "node-pty";
import { Terminal } from "xterm";
import * as fit from "xterm/lib/addons/fit/fit";
// import * as ligatures from "xterm-addon-ligatures";
import _debounce from "lodash.debounce";

Terminal.applyAddon(fit);
// Terminal.applyAddon(ligatures);

const term = new Terminal({
  // fontFamily: "Fira Code, Iosevka, monospace",
  fontFamily: "monospace",
  fontSize: 12,
  experimentalCharAtlas: "dynamic"
});

term.open(document.getElementById("app"));
term.enableLigatures();
term.fit();

const ptyProc = pty.spawn(
  os.platform() === "win32"
    ? "powershell.exe"
    : process.env.SHELL || "/bin/bash",
  [],
  {
    cols: term.cols,
    rows: term.rows
  }
);

const fitDebounced = _debounce(() => {
  term.fit();
}, 17);

term.on("data", data => {
  ptyProc.write(data);
});

term.on("resize", size => {
  ptyProc.resize(
    Math.max(size ? size.cols : term.cols, 1),
    Math.max(size ? size.rows : term.rows, 1)
  );
});

ptyProc.on("data", data => {
  term.write(data);
});

window.onresize = () => {
  fitDebounced();
};
