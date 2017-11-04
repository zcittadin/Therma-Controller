import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { ThermaComponent } from './modules/therma/therma.component';

const routes: Routes = [
    
    { path: "", redirectTo: "/therma", pathMatch: "full" },
    { path: "therma", component: ThermaComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }