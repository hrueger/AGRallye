import { Titlebar, Color } from "custom-electron-titlebar";
import { Component, OnInit } from "@angular/core";
import { remote } from "electron";
import Swal from "sweetalert2";
import { Team } from "../../_models/Team";

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
        this.sendTeams();
    }

    ngOnInit(): void {
        // eslint-disable-next-line no-new
        new Titlebar({
            backgroundColor: Color.fromHex("#FFFFFF"),
            menu: undefined,
            titleHorizontalAlignment: "left",
        });
    }

    public updateCountdown(): void {
        remote.ipcMain.emit("setup-countdown", this.countdownMode, this.countdownMode == "zero" ? [this.zeroHours, this.zeroMinutes] : this.minutes);
    }

    public deleteTeam(event: Event, index: number): void {
        event.preventDefault();
        event.stopPropagation();
        Swal.fire({
            showConfirmButton: true,
            confirmButtonText: "Team löschen",
            showCancelButton: true,
            focusCancel: true,
            title: "Soll das Team wirklich gelöscht werden?",
        }).then((r) => {
            if (r.isConfirmed) {
                this.teams = this.teams.filter((_, idx) => idx !== index);
                this.currentTeamIdx = undefined;
                this.saveTeams();
            }
        });
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
        this.sendTeams();
    }

    private sendTeams() {
        remote.ipcMain.emit("update-teams", this.teams);
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
}
