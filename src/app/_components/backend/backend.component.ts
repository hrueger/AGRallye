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

    public showCountdown = true;
    public config = {
        leftTime: 60 * 60,
        stopTime: undefined,
    };

    constructor() {
        this.teams = JSON.parse(localStorage.getItem("teams") || "null") || [];
    }

    ngOnInit(): void {
        // eslint-disable-next-line no-new
        new Titlebar({
            backgroundColor: Color.fromHex("#FFFFFF"),
            menu: undefined,
            titleHorizontalAlignment: "left",
        });
        this.sendTeams();
        setTimeout(() => {
            this.sendTeams();
        }, 1000);
    }

    public updateCountdown(): void {
        remote.ipcMain.emit("setup-countdown", this.countdownMode, this.countdownMode == "zero" ? [this.zeroHours, this.zeroMinutes] : this.minutes);
        if (this.countdownMode == "zero") {
            this.config.leftTime = undefined;
            this.config.stopTime = new Date();
            this.config.stopTime.setHours(this.zeroHours);
            this.config.stopTime.setMinutes(this.zeroMinutes);
        } else {
            this.config.leftTime = this.minutes * 60;
        }
        this.showCountdown = false;
        setTimeout(() => {
            this.showCountdown = true;
        }, 100);
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

    public deleteTask(index: number): void {
        Swal.fire({
            showConfirmButton: true,
            confirmButtonText: "Aufgabe löschen",
            showCancelButton: true,
            focusCancel: true,
            title: "Soll diese Aufgabe wirklich gelöscht werden?",
        }).then((r) => {
            if (r.isConfirmed) {
                this.teams[this.currentTeamIdx].tasks = this.teams[this.currentTeamIdx]
                    .tasks.filter((_, idx) => idx !== index);
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
