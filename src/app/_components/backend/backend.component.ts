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

    constructor() {
        this.teams = JSON.parse(localStorage.getItem("teams") || "null") || [];
    }

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
        this.saveTeams();
    }

    private saveTeams() {
        localStorage.setItem("teams", JSON.stringify(this.teams));
    }

    public async addTask(): Promise<void> {
        this.teams[this.currentTeamIdx].tasks.push({
            task: (await Swal.fire({
                input: "text",
                title: "Aufgabentitel eingeben",
            }) as any).value,
            points: parseInt((await Swal.fire({
                input: "number",
                title: "Punkte eingeben",
                inputValue: "1",
            }) as any).value) || 0,
        });
        this.saveTeams();
    }

    public getSum(team: Team): number {
        return team.tasks.map((t) => t.points).reduce((a, b) => a + b, 0);
    }
}
