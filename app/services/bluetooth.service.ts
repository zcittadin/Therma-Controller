import { Injectable } from '@angular/core';
import { BleDevice } from '../models/ble-device.model';
var bluetooth = require("nativescript-bluetooth");

@Injectable()
export class BluetoothService {
    bleDevicesAround: Array<BleDevice> = new Array;

    write(bluetoothMessage): void {
        console.log('Escrevendo valor: ' + JSON.stringify(bluetoothMessage));
        bluetooth.write(bluetoothMessage)
            .then((result) => console.log("Valor escrito: " + JSON.stringify(result)),
            (error) => console.log("Erro ao escrever: " + error));
    }

    notify(bluetoothMessage): void {
        bluetooth.startNotifying(bluetoothMessage)
            .then((result) => { },
            (error) => console.log("Erro ao ler dispositivo: " + error));
    }

    fixPermission(): void {
        bluetooth.hasCoarseLocationPermission()
            .then((granted) => {
                console.log("Existe location permission? " + granted);

                if (!granted) {
                    bluetooth.requestCoarseLocationPermission()
                        .then(() => console.log("Location permission requisitada."));
                }
            });
    }

    connect(UUID: string): Promise<any> {
        return bluetooth.connect({
            UUID: UUID,
            onConnected: (peripheral) => {
                console.log("Dispositivo conectado com UUID: " + peripheral.UUID);
                peripheral.services.forEach(function (service) {
                    //console.log("Service found: " + JSON.stringify(service));
                });
            },
            onDisconnected: (peripheral) => {
                console.log("Dispositivo desconectado com UUID: " + peripheral.UUID);
            }
        });
    }

    disconnect(UUID: string): Promise<any> {
        return bluetooth.disconnect({ UUID: UUID })
            .then(() => { },
            (err) => console.log("Erro ao desconectar: " + err));
    }

    scan(): Promise<any> {
        this.bleDevicesAround = new Array;

        return bluetooth.startScanning({
            serviceUUIDs: [],
            seconds: 3,
            onDiscovered: (device) => {
                console.log("UUID: " + device.UUID);
                console.log("Name: " + device.name);
                console.log("State: " + device.state);

                const bleDevice = new BleDevice(device.UUID, device.name, device.state);
                this.bleDevicesAround.push(bleDevice);
            }
        });
    }

    isBluetoothEnabled(): Promise<boolean> {
        return bluetooth.isBluetoothEnabled().then((enabled) => {
            return enabled;
        }
        );
    }
}