import {
    Component, OnInit, ViewChild, NgZone,
} from "@angular/core";
import { remote } from "electron";
import { CountdownComponent } from "ngx-countdown";
import { SumPointsPipe } from "src/app/_pipes/sum-points.pipe";
import { Team } from "../../_models/Team";

declare const FlipClock: any;
declare const $: any;

@Component({
    selector: "app-frontend",
    templateUrl: "./frontend.component.html",
    styleUrls: ["./frontend.component.scss"],
})
export class FrontendComponent implements OnInit {
    public teams: Team[];
    public maxPoints = 60;
    public zero: any = new Date(2020, 10, 9, 20, 0);
    public config = {
        leftTime: 60 * 60,
        stopTime: undefined,
    };

    public showPlaces = false;
    @ViewChild("cd", { static: false }) private countdown: CountdownComponent;
    showCountdown = true;

    constructor(private zone: NgZone) {}

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        remote.ipcMain.on("update-teams", (teams: Team[]) => {
            this.zone.run(() => {
                this.teams = teams;
            });
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        remote.ipcMain.on("show-places", (v: boolean) => {
            this.zone.run(() => {
                this.showPlaces = v;
            });
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        remote.ipcMain.on("update-max-points", (v: number) => {
            this.zone.run(() => {
                this.maxPoints = v;
            });
        });
    }

    public getPlace(team: Team): number {
        const teamsToSort = [];
        for (const t of this.teams) {
            teamsToSort.push(t);
        }
        return teamsToSort.sort((a, b) => {
            const aPoints = new SumPointsPipe().transform(a);
            const bPoints = new SumPointsPipe().transform(b);
            if (aPoints < bPoints) {
                return 1;
            }
            if (bPoints < aPoints) {
                return -1;
            }
            return 0;
        }).indexOf(team) + 1;
    }
}
