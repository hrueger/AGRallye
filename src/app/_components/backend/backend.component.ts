import { Titlebar, Color } from "custom-electron-titlebar";
import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-backend",
    templateUrl: "./backend.component.html",
    styleUrls: ["./backend.component.scss"],
})
export class BackendComponent implements OnInit {
    ngOnInit(): void {
        const t = new Titlebar({
            backgroundColor: Color.fromHex("#ECECEC"),
        });
        console.log(t);
    }
}
