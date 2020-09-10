import { Titlebar, Color } from "custom-electron-titlebar";
import { Component, OnInit } from "@angular/core";
import { remote } from "electron";

@Component({
    selector: "app-backend",
    templateUrl: "./backend.component.html",
    styleUrls: ["./backend.component.scss"],
})
export class BackendComponent implements OnInit {
    public countdownMode: string;
    public minutes: number;
    public zeroHours: number;
    public zeroMinutes: number;
    ngOnInit(): void {
        const t = new Titlebar({
            backgroundColor: Color.fromHex("#ECECEC"),
        });
    }

    public updateCountdown(): void {
        remote.ipcMain.emit("setup-countdown", this.countdownMode, this.countdownMode == "zero" ? [this.zeroHours, this.zeroMinutes] : this.minutes);
    }
}
