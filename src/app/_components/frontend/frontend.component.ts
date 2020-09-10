import {
    Component, OnInit, ViewChild, NgZone,
} from "@angular/core";
import { remote } from "electron";
import { CountdownComponent } from "ngx-countdown";

declare const FlipClock: any;
declare const $: any;

@Component({
    selector: "app-frontend",
    templateUrl: "./frontend.component.html",
    styleUrls: ["./frontend.component.scss"],
})
export class FrontendComponent implements OnInit {
    constructor(private zone: NgZone) {}
    public zero: any = new Date(2020, 10, 9, 20, 0);
    public config = {
        leftTime: 60 * 60,
        stopTime: undefined,
    };
    @ViewChild("cd", { static: false }) private countdown: CountdownComponent;
    showCountdown = true;

    ngOnInit(): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        remote.ipcMain.on("setup-countdown", (mode: "zero" | "timespan", d: [number, number] | number) => {
            this.zone.run(() => {
                if (mode) {
                    if (Array.isArray(d)) {
                        this.config.leftTime = undefined;
                        this.config.stopTime = new Date();
                        this.config.stopTime.setHours(d[0]);
                        this.config.stopTime.setMinutes(d[1]);
                    } else {
                        this.config.leftTime = d * 60;
                    }
                    this.showCountdown = false;
                    setTimeout(() => {
                        this.showCountdown = true;
                    }, 100);
                }
            });
        });
    }
}
