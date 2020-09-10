import { Titlebar, Color } from "custom-electron-titlebar";
import { Component, OnInit } from "@angular/core";
import { remote } from "electron";
import Swal from "sweetalert2";

type Team = {
    name: string,
    tasks: {
        task: string,
        points: number,
    }[],
}

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

    public teams: Team[] = [];
    public currentTeamIdx: number;

    ngOnInit(): void {
        const t = new Titlebar({
            backgroundColor: Color.fromHex("#ECECEC"),
        });
    }

    public updateCountdown(): void {
        remote.ipcMain.emit("setup-countdown", this.countdownMode, this.countdownMode == "zero" ? [this.zeroHours, this.zeroMinutes] : this.minutes);
    }

    public async addTeam(): Promise<void> {
        this.teams.push({
            name: (await Swal.fire({
                input: "text",
                title: "Teamnamen eingeben",
            }) as any).value,
            tasks: [],
        });
    }

    public async addTask(): Promise<void> {
        this.teams[this.currentTeamIdx].tasks.push({
            task: (await Swal.fire({
                input: "text",
                title: "Teamnamen eingeben",
            }) as any).value,
            points: (await Swal.fire({
                input: "number",
                title: "Punkte eingeben",
            }) as any).value,
        });
    }

    public getSum(team: Team): number {
        return team.tasks.map((t) => t.points).reduce((a, b) => a + b, 0);
    }
}
