/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import {
    app, BrowserWindow, ipcMain, screen,
} from "electron";
import * as path from "path";
import * as url from "url";
import { autoUpdater } from "electron-updater";

let backendWindow: BrowserWindow = null;
let frontendWindow: BrowserWindow = null;
const args = process.argv.slice(1);
const serve = args.some((val) => val === "--serve");

function createWindows(): void {
    const displays = screen.getAllDisplays();
    const externalDisplay = displays.find(
        (display) => display.bounds.x !== 0 || display.bounds.y !== 0,
    );
    backendWindow = new BrowserWindow({
        icon: path.join(__dirname, "src/assets/icons/icon.png"),
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            allowRunningInsecureContent: !!(serve),
            enableRemoteModule: true,
        },
        frame: false,
        backgroundColor: "#1E1E1E",
        minHeight: 600,
        minWidth: 1200,
    });
    frontendWindow = new BrowserWindow({
        icon: path.join(__dirname, "src/assets/icons/icon.png"),
        x: externalDisplay?.bounds?.x || 0,
        y: externalDisplay?.bounds?.y || 0,
        fullscreen: !!externalDisplay,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            allowRunningInsecureContent: !!(serve),
            enableRemoteModule: true,
        },
        frame: false,
        backgroundColor: "#1E1E1E",
        minHeight: 600,
        minWidth: 1200,
    });

    if (serve) {
        backendWindow.webContents.openDevTools();
        frontendWindow.webContents.openDevTools();

        require("electron-reload")(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`),
        });
        backendWindow.loadURL("http://localhost:4200/#/backend");
        frontendWindow.loadURL("http://localhost:4200");
    } else {
        backendWindow.loadURL(`${url.format({
            pathname: path.join(__dirname, "dist/index.html"),
            protocol: "file:",
            slashes: true,
        })}#/backend`);
        frontendWindow.loadURL(url.format({
            pathname: path.join(__dirname, "dist/index.html"),
            protocol: "file:",
            slashes: true,
        }));
    }

    ipcMain.on("update-teams", (data: any) => {
        frontendWindow.emit("update-teams", ...data);
    });
    ipcMain.on("setup-countdown", (...data: any) => {
        frontendWindow.emit("setup-countdown", ...data);
    });
    ipcMain.on("show-places", (...data: any) => {
        frontendWindow.emit("show-places", ...data);
    });

    backendWindow.on("closed", () => {
        app.quit();
    });
    frontendWindow.on("closed", () => {
        app.quit();
    });

    autoUpdater.checkForUpdatesAndNotify();
}

try {
    app.allowRendererProcessReuse = false;

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    app.on("ready", () => setTimeout(createWindows, 400));
} catch (e) {
    // Catch Error
    // throw e;
}
