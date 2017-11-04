import { Component, AfterViewInit, ElementRef, ViewChild, ViewContainerRef } from "@angular/core";
import { setInterval, clearTimeout } from "timer";

import { Button } from "ui/button";
import { Color } from "color";

import { RadialNeedle } from "nativescript-pro-ui/gauges";

import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";

import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { ModalComponent } from "../modal/app.modal";

import { DeviceCommandService } from '../../services/device-command.service';
import { BluetoothService } from '../../services/bluetooth.service';

@Component({
    selector: "Therma",
    moduleId: module.id,
    templateUrl: "therma.component.html",
    styleUrls: ["therma.css"]
})
export class ThermaComponent implements AfterViewInit {

    scanRate;
    setPoint: number;
    dataRead: any;
    spRead: number = 0;
    temperatura: number = 0;
    private checkConnection: number = 0;
    private isConnected: boolean = false;
    private btnConnect: any;
    private needle: any;
    private toConnectColor = new Color("#0044FF");
    private connectedColor = new Color("#004D40");
    private isConnectingColor = new Color("#FFD600");

    @ViewChild("btnConnect") btnConnectRef: ElementRef;
    @ViewChild("needle") needleRef: ElementRef;

    constructor(private deviceCommandService: DeviceCommandService,
        private bluetoothService: BluetoothService,
        private modal: ModalDialogService, private vcRef: ViewContainerRef) { }

    ngAfterViewInit() {
        this.btnConnect = <Button>this.btnConnectRef.nativeElement;
        this.needle = <RadialNeedle>this.needleRef.nativeElement;
    }

    public toggleConnection() {
        this.deviceCommandService.isBluetoothEnabled().then((enabled) => {
            if (enabled) {
                if (!this.isConnected) {
                    this.btnConnect.text = "Conectando...";
                    this.btnConnect.backgroundColor = this.isConnectingColor;
                    this.connect();
                }
                else {
                    this.btnConnect.text = "Desconectando...";
                    this.btnConnect.backgroundColor = this.isConnectingColor;
                    this.disconnect();
                }
            } else {
                TNSFancyAlert.showWarning("Atenção", "Bluetooth desablilitado.", "Voltar");
                this.btnConnect.text = "Conectar";
                this.btnConnect.backgroundColor = this.toConnectColor;
            }
        });
    }

    public changeSp() {
        let options = {
            context: {},
            fullscreen: true,
            viewContainerRef: this.vcRef
        };
        this.modal.showModal(ModalComponent, options).then(res => {
            this.setPoint = res;
            this.send();
        });
    }

    public send() {
        if (!this.isConnected) {
            TNSFancyAlert.showWarning("Atenção", "Desconectado do dispositivo.", "Voltar");
            this.setPoint = null;
            return;
        }
        else {
            if (this.setPoint != null)
                this.deviceCommandService.sendValue(this.setPoint);
        }
    }

    private connect() {
        this.deviceCommandService.connectToDevice().then((device) => {
            if (device == null) {
                this.btnConnect.text = "Conectar";
                this.btnConnect.backgroundColor = this.toConnectColor;
                TNSFancyAlert.showWarning("Atenção", "Dispositivo não encontrado", "Voltar");
                this.isConnected = false;
                return;
            }
            this.btnConnect.text = "Conectado";
            this.btnConnect.backgroundColor = this.connectedColor;
            this.isConnected = true;
            this.scanRate = setInterval(() => {
                if (this.deviceCommandService.readValue()) {
                    this.checkConnection = 0;
                    this.dataRead = this.deviceCommandService.getTemperatura();
                    if (this.dataRead == null) {
                        this.temperatura = 0;
                        this.spRead = 0;
                    } else {
                        if (this.dataRead.length > 4) {
                            this.dataRead = null
                            this.cancelConnection();
                        }
                        this.temperatura = this.convertToByteArray(this.dataRead[0], this.dataRead[1]);
                        this.spRead = this.convertToByteArray(this.dataRead[2], this.dataRead[3]);
                    }
                    this.needle.value = this.temperatura;
                } else {
                    this.checkConnection++;
                    if (this.checkConnection > 3) {
                        this.cancelConnection();
                    }
                }
            }, 1000);
        });
    }

    private disconnect() {
        this.deviceCommandService.disconnectToDevice().then((device) => {
            if (device != null) {
                clearTimeout(this.scanRate);
                this.temperatura = 0;
                this.spRead = 0;
                this.needle.value = 0;
                this.btnConnect.text = "Conectar";
                this.btnConnect.backgroundColor = this.toConnectColor;
                this.isConnected = false;
                TNSFancyAlert.showSuccess("Aviso", "A conexão foi finalizada com sucesso.", "Voltar");
            } else {
                TNSFancyAlert.showError("Erro!", "Ocorreu uma falha ao tentar deconectar.", "Voltar");
            }
        });
    }

    private cancelConnection() {
        clearTimeout(this.scanRate);
        this.temperatura = 0;
        this.spRead = 0;
        this.needle.value = 0;
        this.btnConnect.text = "Conectar";
        this.btnConnect.backgroundColor = this.toConnectColor;
        this.isConnected = false;
        this.checkConnection = 0;
        TNSFancyAlert.showError("Erro!", "O dispositivo não está mais respondendo.", "Voltar");
    }

    private convertToByteArray(highByte: number, lowByte: number): number {
        if (highByte == 0)
            return lowByte;
        if (highByte > 0)
            return 256 * highByte + lowByte;
        return 0;
    }

}