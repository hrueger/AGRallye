import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FrontendComponent } from "./_components/frontend/frontend.component";
import { BackendComponent } from "./_components/backend/backend.component";

const routes: Routes = [
    {
        path: "",
        component: FrontendComponent,
    },
    {
        path: "backend",
        component: BackendComponent,
    },
    {
        path: "**",
        redirectTo: "",
    },
];

@NgModule({
    declarations: [
        AppComponent,
        FrontendComponent,
        BackendComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule.forRoot(routes),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
