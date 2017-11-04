import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NSModuleFactoryLoader } from "nativescript-angular/router";
import { NativeScriptUIGaugesModule } from "nativescript-pro-ui/gauges/angular";
import { ModalDialogService } from "nativescript-angular/modal-dialog";

import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";
import { ThermaComponent } from './modules/therma/therma.component';
import { ModalComponent } from "./modules/modal/app.modal";

import { DeviceCommandService } from './services/device-command.service';
import { BluetoothService } from './services/bluetooth.service';

@NgModule({
  declarations: [
    AppComponent,
    ThermaComponent,
    ModalComponent
  ],
  entryComponents: [ModalComponent],
  bootstrap: [
    AppComponent,
  ],
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptUIGaugesModule,
    AppRoutingModule
  ],

  providers: [
    // { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader },
    ModalDialogService,
    DeviceCommandService,
    BluetoothService
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
})
export class AppModule { }
