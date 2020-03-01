// ₍₍⁽⁽🍪₎₎⁾⁾ look! Cookie is dancing! it's so cute!
// 🍪 Cookie has stopped dancing, because everybody always use it for tracking.
// this is your fault!

const { app, BrowserWindow } = require('electron')

// @see https://www.npmjs.com/package/commander
const program = require('commander');
program
  .option('-w, --window-mode', 'boot text-proofreader app')
  .option('-d, --debug', 'open devtools')
  .option('-t, --text <content>', 'proofreading text');

// electron-builder で exe 化したときのエラー回避策 
// @note https://github.com/tj/commander.js/issues/512
if (process.argv.length == 0) {
  program.help();
  process.exit(0);
}
program.parse(process.argv);

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile('index.html');

  if (program.debug) {
    // Open the DevTools.
    win.webContents.openDevTools();
  }
}

if (program.windowMode) {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(()=>{
    createWindow();
  });
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    process.stdout.write("keep process");
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
} else {
  app.on('window-all-closed', () => {
    // app.quit() を呼び出さなければ、ここでプロセスをキープできるかと思いきや
    // ウィンドウが出ていないとそもそもこのイベントはコールされない
    process.stdout.write("window-all-closed");
  });

  app.on('ready', () => {
    const win = new BrowserWindow({ show: false });
    win.destroy();
  });

  if (program.text) {
    const textlint = require("textlint");
    const textLineEngine = new textlint.TextLintEngine({
      configFile: '.textlintrc'
    });
    textLineEngine.executeOnText(program.text, '.txt').then(results => {
      //process.stdout.write(JSON.stringify(results[0].messages));
      process.exit(0);
    }, error => {
      process.stdout.write("textlint error occurred." + error);
      process.exit(0);
    });
    process.stdout.write("wait for process");
  }
  process.stdout.write("exit process");
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
