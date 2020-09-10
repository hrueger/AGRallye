import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import localeDe from "@angular/common/locales/de";
import localeDeExtra from "@angular/common/locales/extra/de";
import { registerLocaleData } from "@angular/common";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FrontendComponent } from "./_components/frontend/frontend.component";
import { BackendComponent } from "./_components/backend/backend.component";
import { CountdownModule } from 'ngx-countdown';

registerLocaleData(localeDe, localeDeExtra);

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
        FormsModule,
        ReactiveFormsModule,
        CountdownModule,
        RouterModule.forRoot(routes, { useHash: true }),
    ],
    providers: [{ provide: LOCALE_ID, useValue: "de" }],
    bootstrap: [AppComponent],
})
export class AppModule { }
