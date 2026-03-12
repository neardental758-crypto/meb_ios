import React from 'react';
import { BleManager } from 'react-native-ble-plx';
import { Alert, Platform } from "react-native";
import { appActions } from '../actions/actions';
import { setButtonStartValidation, setEndTripValidation } from '../actions/rideActions';
import { appTypes } from '../types/types';
global.Buffer = global.Buffer || require('buffer').Buffer;
import { api } from '../api/api.service';
import { SET_ERROR_MESSAGE, START_TRIP } from '../types/rideTypes';
let keyComunication = 0x11;
function getRandomByte() {
    return Math.floor(Math.random() * 256);
}
const getStore = () => {
    try {
        return require('./configure').default;
    } catch (e) {
        console.log('Store not ready yet', e);
        return { dispatch: () => { } };
    }
};

function crc16(data) {

    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
        crc = crc ^ data[i];
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x0001) === 0x0001) {
                crc = crc >> 1;
                crc = crc ^ 0xA001;
            } else {
                crc = crc >> 1;
            }

        }
    }
    var res = crc;
    return divideCRCinTwo(res);
}

function getTimeStampBytes() {
    var date = Date.now();
    console.log('Date.now()', date);
    var bytes = new Array();
    for (i = 0; i < 4; i++) {
        bytes[i] = (date >> (8 * i)) & 0xff;
    }
    return bytes;
}

//convert a string to byte
function stringToByte(str) {
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        bytes.push(char);
    }
    return bytes;
}

function divideCRCinTwo(crc) {
    let ffff = 65535;
    let intCrc = parseInt(crc);
    let array = []
    if (intCrc <= ffff && intCrc >= 0) {
        let position1 = Math.floor(intCrc / 256);
        let residuo = intCrc % 256;
        array.push(position1);
        array.push(residuo);
    } else {
        return "crc invalido, debe ser menor que 65535";
    }
    return array;
}


function arrayToHex(array) {
    var arr = [];
    for (var i = 0, l = array.length; i < l; i++) {
        var hex = Number(array[i]).toString(16);
        arr.push("0x" + hex);
    }
    return arr;
}

export default class BluetoothService {
    constructor() {
        console.log("BluetoothService creado", new Date());
        this.manager = new BleManager();
        this.connectedDevice = null;
        this.state = null;
        this.key = "cxNOs4Zg";
        this.deviceChar = null;
        this.dataEncoded = null;
        this.writeCharacteristic = null;
        this.listener = null;
        this.openedCommandState = false;
        this.statusCommandState = false;
        this.id = "";
        this.bluetoothState = false;
        this.timeout = null;
        //State variables of the process
        this.deviceFound = false;
        this.keyRecieved = false;
        this.endTripValidation = {};
        this.lockModel = "modelA";
    }

    initProcessVariables() {
        //this.connectedDevice = null;
        this.deviceFound = false;
        this.keyRecieved = false;
        this.openedCommandState = false;
        this.statusCommandState = false;
        this.lockModel = "modelA";

    }


    async removeDeviceState() {
        console.log("this.connectedDevice", this.connectedDevice);
        console.log("this.listener", this.listener);
        this.initProcessVariables();
        this.listener.remove();
        if (this.connectedDevice && this.connectedDevice.id && this.manager) {
            this.disconnectFromDevice();
        }
    }

    waitUntilDeviceState(mac, id, is5g = false) {
        this.id = id;
        this.is5g = is5g;
        this.initProcessVariables();
        console.log("waitUntilDeviceState Called", this.id)
        console.log("waitUntil device", this.connectedDevice);
        this.listener = this.manager.onStateChange(async (state) => {
            console.log("---Listener-----", state);
            if (state === 'PoweredOn') {
                console.log("encendido");
                this.bluetoothState = true;
                // Start scanning once BLE is confirmed powered on
                this.scanForDevices(mac);
            } else if (state === 'PoweredOff') {
                console.log("se apago pues cierra este candado", this.id);
                getStore().dispatch({ type: appTypes.setBluetoothLoader, payload: false });
                getStore().dispatch({ type: SET_ERROR_MESSAGE, payload: "El Bluetooth está apagado. Por favor actívalo e intenta de nuevo." });
                let changeLock = { lockStatus: "closed" };
                await api.patchField("locks", this.id, changeLock);
                this.manager.stopDeviceScan();
                await this.removeDeviceState();
            } else if (state === 'Unauthorized') {
                console.log("BLE no autorizado");
                getStore().dispatch({ type: appTypes.setBluetoothLoader, payload: false });
                getStore().dispatch({ type: SET_ERROR_MESSAGE, payload: "La app no tiene permiso para usar Bluetooth. Ve a Configuración → Privacidad → Bluetooth y activa el permiso para esta app." });
                await this.removeDeviceState();
            } else {
                this.bluetoothState = false;
                console.log("BLE state:", state);
            }
        }, true);
    }

    encryptData(data) {
        let rand = data[1] + 0x32;
        let newData = [data[0], rand];
        let encrypted;
        for (let i = 2; i < data.length; i++) {
            encrypted = data[i] ^ data[1];
            newData.push(encrypted);
        }
        return newData;
    }

    /**
     * Wait until BLE manager is ready (PoweredOn) or reject with a meaningful error.
     * Returns a Promise that resolves with the manager state.
     */
    waitForBleReady(timeoutMs = 8000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                sub.remove();
                reject(new Error("Tiempo de espera agotado esperando el Bluetooth. Asegúrate de que esté encendido e intenta de nuevo."));
            }, timeoutMs);

            const sub = this.manager.onStateChange((state) => {
                console.log('[BLE] State:', state);
                if (state === 'PoweredOn') {
                    clearTimeout(timer);
                    sub.remove();
                    resolve(state);
                } else if (state === 'PoweredOff') {
                    clearTimeout(timer);
                    sub.remove();
                    reject(new Error("El Bluetooth está apagado. Por favor actívalo e intenta de nuevo."));
                } else if (state === 'Unauthorized') {
                    clearTimeout(timer);
                    sub.remove();
                    reject(new Error("La app no tiene permiso para usar Bluetooth. Ve a Configuración → Privacidad → Bluetooth y activa el permiso para esta app."));
                } else if (state === 'Unsupported') {
                    clearTimeout(timer);
                    sub.remove();
                    reject(new Error("Este dispositivo no soporta Bluetooth Low Energy."));
                }
                // Ignore 'Unknown' and 'Resetting' — wait for next state change
            }, true);
        });
    }

    async scanForDevices(mac) {
        // Guard: check BLE state before scanning
        try {
            await this.waitForBleReady(5000);
        } catch (bleErr) {
            console.log('[BLE] Not ready to scan:', bleErr.message);
            getStore().dispatch({ type: appTypes.setBluetoothLoader, payload: false });
            getStore().dispatch({ type: SET_ERROR_MESSAGE, payload: bleErr.message });
            return;
        }
        setTimeout(async () => {
            if (this.deviceFound) {
                console.log("encontramos el candado");
            } else {
                getStore().dispatch({ type: appTypes.setBluetoothLoader, payload: false });
                getStore().dispatch({ type: SET_ERROR_MESSAGE, payload: "No encontramos el candado en los dispositivos cercanos. Asegúrate de estar cerca del candado." });
                console.log("No encontramos el candado");
                this.manager.stopDeviceScan();
                await this.removeDeviceState();
            }
        }, 10000);
        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log("Error scan")
            } else {
                console.log("device");
                console.log(device);
                if (Platform.OS == 'android') {
                    if (device.id == mac) {
                        console.log("device found", device);
                        this.connectToDevice(device);
                    }
                } else {
                    if (device.localName == "LOCK") {
                        console.log("device found", device);
                        this.connectToDevice(device);
                    }
                }

            }
        });
    };

    obtainUnlockKeyCommand(deviceKey) {
        console.log("obtainUnlockKeyCommand", deviceKey);
        let arrayData = [];
        let stx = 0xFE;
        let key = 0x00;
        let cmd = 17;
        let len = deviceKey.length;
        let data = stringToByte(deviceKey);
        //push all above variables in this function to arrayData in order
        arrayData[0] = stx;
        arrayData[1] = 0x34; // Fixed byte from original service.js
        arrayData[2] = key;
        arrayData[3] = cmd;
        arrayData[4] = len;
        arrayData[5] = data;
        arrayData = arrayData.flat();
        let encryptedData = this.encryptData(arrayData);
        let crc = crc16(encryptedData);
        encryptedData.push(crc[0]);
        encryptedData.push(crc[1]);
        return encryptedData;
    }

    async listenCharValue(buffer) {
        console.log("buffer", buffer)
        this.decryptResponse(buffer);
    }

    waitUntilLockOpened() {
        setTimeout(async () => {
            if (this.openedCommandState) {
                console.log("El candado abrio, bien!");
                this.removeDeviceState();
            } else {
                getStore().dispatch({ type: appTypes.setBluetoothLoader, payload: false });
                getStore().dispatch({ type: SET_ERROR_MESSAGE, payload: "El candado no abrio por medio de bluetooth, contacta soporte (timeStamp)" });
                console.log("Obtuvimos key, pero candado no abrio, revisar Timestamp con BLE");
                this.manager.stopDeviceScan();
                await this.removeDeviceState();
            }
        }, 10000);
    }

    async decryptResponse(buffer) {
        let uint8 = new Uint8Array(buffer);
        console.log("Hex uint8", uint8[0] == 0xFE);
        if (uint8.length > 0 && uint8[0] == 0xfe) {
            let decrypt1 = this.decryptData(uint8);
            console.log("mensaje recibido", decrypt1);
            console.log("Hex mensaje recibido", arrayToHex(decrypt1));
            if (decrypt1[3] == 0x11) {
                console.log("recibimos llave, ahora abramos el candado");
                this.keyRecieved = true;
                keyComunication = decrypt1[2];
                let unlockCommand = this.sendUnlockCommand(keyComunication);
                this.writeCharacteristic.writeWithoutResponse(Buffer.from(new Uint8Array(unlockCommand)).toString('base64')).then(resWrite => {

                });
                this.waitUntilLockOpened();
            } else if (decrypt1[3] == 0x21) {
                console.log("this.lockModel", this.lockModel);
                if (this.lockModel == "modelC") {
                    if (decrypt1[5] == 0x00) {
                        this.confirmLockOpen();
                    } else {
                        console.log("No abrio candado tipo C");
                    }
                } else {
                    this.confirmLockOpen();
                }
            }
        } else {
            //the lock doesnt open, this is a issue with the lock, close the loader, set lockState to closed and return an Alert to the user                                    
            console.log("empty response");
        }
    }

    async confirmLockOpen() {
        this.openedCommandState = true;
        console.log("candado abierto, GREAT!");
        this.manager.stopDeviceScan();
        let confirmCommand = this.unlockConfirmationCommand(keyComunication);
        await this.writeCharacteristic.writeWithoutResponse(Buffer.from(new Uint8Array(confirmCommand)).toString('base64'));
        //this.removeDeviceState();
        //lock opened, now lets change the lock state in db 
        let changeLock = {
            lockStatus: "closed"
        }
        await api.patchField("locks", this.id, changeLock);
        //now close the loader and start this trip, we are ready
        getStore().dispatch({ type: appTypes.setBluetoothLoader, payload: false });
        if (!this.is5g) {
            getStore().dispatch({ type: START_TRIP });
        } else {
            console.log("5G Lock opened successfully via legacy handshake!");
        }

    }

    unlockConfirmationCommand(key) {
        let arrayData = [];
        //index 0
        arrayData.push(0xfe);
        //index 1
        arrayData.push(0x29);//Fixed byte from original service.js
        //index 2
        arrayData.push(key);//keyComunication
        //index 3
        arrayData.push(0x21);//command
        //index 4
        arrayData.push(0x00);//command
        console.log("Hex response", arrayToHex(arrayData));
        let encryptedData = this.encryptData(arrayData);
        let crc = crc16(encryptedData);
        encryptedData.push(crc[0]);
        encryptedData.push(crc[1]);
        console.log("Hex encrypted response", arrayToHex(encryptedData));
        return encryptedData;
    }

    sendUnlockCommand(key) {
        let arrayData = [0xfe, 0x39, key, 0x21, 0x08]; // 0x39 is fixed byte from original service.js
        let userId = [0x02, 0x00, 0x09, 0x09];
        arrayData = arrayData.concat(userId);
        let timeStamp = getTimeStampBytes();
        arrayData = arrayData.concat(timeStamp);
        if (this.lockModel == "modelC") {
            arrayData[4] = 0x09;
            arrayData.push(0x01);
        }
        console.log("arrayData unlock", arrayData);
        console.log("Hex arrayData unlock", arrayToHex(arrayData));
        let encryptedData = this.encryptData(arrayData);
        let crc = crc16(encryptedData);
        encryptedData.push(crc[0]);
        encryptedData.push(crc[1]);
        console.log("encryptedData unlock", encryptedData);
        console.log("Hex encryptedData unlock", arrayToHex(encryptedData));
        return encryptedData;
    }

    sendClearDataCommand(key) {
        // Command 0x52: Clear unuploaded data (from Manufacturer PDF)
        // This prevents buffer saturation after multiple resets
        let arrayData = [0xfe, getRandomByte(), key, 0x52, 0x00];
        let encryptedData = this.encryptData(arrayData);
        let crc = crc16(encryptedData);
        encryptedData.push(crc[0]);
        encryptedData.push(crc[1]);
        console.log("Hex encryptedData clear data", arrayToHex(encryptedData));
        return encryptedData;
    }

    sendResetCommand(key) {
        // Prototype reset command based on research [0x01, 0x02, 0x03, ...timestamp]
        // Following the existing protocol structure: STX, Random, Key, CMD, LEN, DATA, CRC
        let arrayData = [0xfe, 0x3a, key, 0x01, 0x07]; // Assuming 0x01 is the reset cmd based on prototype
        let resetSequence = [0x01, 0x02, 0x03];
        arrayData = arrayData.concat(resetSequence);
        let timeStamp = getTimeStampBytes();
        arrayData = arrayData.concat(timeStamp);

        console.log("arrayData reset", arrayData);
        console.log("Hex arrayData reset", arrayToHex(arrayData));
        let encryptedData = this.encryptData(arrayData);
        let crc = crc16(encryptedData);
        encryptedData.push(crc[0]);
        encryptedData.push(crc[1]);
        console.log("encryptedData reset", encryptedData);
        console.log("Hex encryptedData reset", arrayToHex(encryptedData));
        return encryptedData;
    }

    buildStatusCommand(key) {
        let arrayData = [0xfe, 0x37, key, 0x31, 0x00]; // 0x37 is fixed byte from original service.js
        let encryptedData = this.encryptData(arrayData);
        let crc = crc16(encryptedData);
        encryptedData.push(crc[0]);
        encryptedData.push(crc[1]);
        console.log("Hex encryptedData unlock", arrayToHex(encryptedData));
        return encryptedData;
    }

    decryptData(date) {
        let data;
        if (date.length >= 12) {
            data = date.slice(0, 12);
        }
        else {
            data = date.slice(0, 8);
        }
        console.log("data ajustada", data)
        let crcData = [data[data.length - 2], data[data.length - 1]];
        let messageEncrypted = data.slice(0, data.length - 2);
        let crcCalc = crc16(messageEncrypted);
        if (crcData[1] == crcCalc[1] && crcData[0] == crcCalc[0]) {
            console.log("crcs SI coinciden");
        } else {
            console.log("crcs NO coinciden");
        }
        let random = data[1] - 0x32;
        let messageDecrypted = [data[0], random];
        let dataLength = data[4] ^ random;
        for (i = 2; i < data.length - 2; i++) {
            messageDecrypted.push(data[i] ^ random);
        }
        for (j = 0; j < messageDecrypted.length; j++) {
            if (messageDecrypted[j] < 0) {
                messageDecrypted[j] = messageDecrypted[j] + 256;
                console.log("NEGATIVO");
            }
        }
        return messageDecrypted;
    }
    probarOtraClave() {
        ////////// codigo add //////////////////////////////////
        if (this.writeCharacteristic) {
            let data = this.obtainUnlockKeyCommand('TA7aCRHe');
            console.log("key command", data)
            this.writeCharacteristic.writeWithoutResponse(Buffer.from(new Uint8Array(data)).toString('base64'))
            setTimeout(async () => {
                if (this.keyRecieved) {
                    console.log("Si obtuvimos la llave");
                } else {
                    getStore().dispatch({ type: appTypes.setBluetoothLoader, payload: false });
                    getStore().dispatch({ type: SET_ERROR_MESSAGE, payload: "No fue posible crear una comunicacion estable con el candado. Acercate al candado e intentalo de nuevo" });
                    console.log("Nos conectamos, pero no obtuvimos la llave");
                    this.manager.stopDeviceScan();
                    await this.removeDeviceState();
                }
            }, 10000)
        }
        ////////////////////////////////////////////////////////
    }

    //connect to a device
    async connectToDevice(deviceData) {
        this.deviceFound = true;
        try {
            //comment all this method
            this.manager.stopDeviceScan();
            setTimeout(async () => {
                if (this.connectedDevice && this.connectedDevice.id) {
                    console.log("Logramos conectarnos al candado");
                } else {
                    getStore().dispatch({ type: appTypes.setBluetoothLoader, payload: false });
                    getStore().dispatch({ type: SET_ERROR_MESSAGE, payload: "No fue posible establecer conexion bluetooth con el candado" });
                    console.log("Lo encontramos, pero no logramos conectarnos");
                    this.manager.stopDeviceScan();
                    await this.removeDeviceState();
                }
            }, 10000);
            let device = await this.manager.connectToDevice(deviceData.id);

            console.log(`1 Connected to device: ${device.id}`);
            this.connectedDevice = device;
            await this.connectedDevice.discoverAllServicesAndCharacteristics();
            const services = await device.services();
            let lockTypes = {
                modelA: {
                    write: "0783b03e-8535-b5a0-7140-a304d2495cba",
                    notify: "0783b03e-8535-b5a0-7140-a304d2495cb8"
                },
                modelC: {
                    write: "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
                    notify: "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
                }
            };
            let lockUuid = lockTypes.modelA;
            this.lockModel = "modelA";
            //Buscar servicio principal
            let mainService = services.find(serv => {
                return serv.uuid == "0783b03e-8535-b5a0-7140-a304d2495cb7";
            });

            if (!mainService) {
                //Try for model C
                mainService = services.find(serv => {
                    return serv.uuid == "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
                });
                if (mainService) {
                    lockUuid = lockTypes.modelC;
                    this.lockModel = "modelC";
                }
            }
            if (mainService) {
                console.log("this.lockModel", this.lockModel);
                console.log("services", mainService);
                let characteristics = await mainService.characteristics();
                console.log("characteristics", characteristics);
                let notifyCharacteristic = characteristics.find(char => {
                    return char.uuid == lockUuid.notify;
                    //return char.uuid == "0783b03e-8535-b5a0-7140-a304d2495cb8";
                });
                console.log("notifyCharacteristic", notifyCharacteristic);

                this.writeCharacteristic = characteristics.find(char => {
                    return char.uuid == lockUuid.write;
                    //return char.uuid == "0783b03e-8535-b5a0-7140-a304d2495cba";
                });
                console.log("this.writeCharacteristic", this.writeCharacteristic);
                this.deviceChar = characteristics;
                if (notifyCharacteristic) {
                    console.log("entra if")
                    notifyCharacteristic.monitor((error, characteristic) => {
                        console.log("monitor", characteristic)
                        if (error) {
                            console.log('error monitor', error);
                        } else {
                            let buff = Buffer.from(characteristic.value, 'base64');
                            this.listenCharValue(buff);
                        }
                    });
                }
                if (this.writeCharacteristic) {
                    let data = this.obtainUnlockKeyCommand(this.key);
                    console.log("key command", data)
                    await this.writeCharacteristic.writeWithoutResponse(Buffer.from(new Uint8Array(data)).toString('base64'))
                    setTimeout(async () => {
                        if (this.keyRecieved) {
                            console.log("Si obtuvimos la llave");
                        } else {
                            /*getStore().dispatch({ type: appTypes.setBluetoothLoader, payload: false });
                            getStore().dispatch({ type: SET_ERROR_MESSAGE, payload: "No fue posible crear una comunicacion estable con el candado. Acercate al candado e intentalo de nuevo" });                    
                            console.log("Nos conectamos, pero no obtuvimos la llave");
                            this.manager.stopDeviceScan();
                            await this.removeDeviceState();*/
                            this.probarOtraClave()
                        }
                    }, 10000)
                }
            }
        } catch (error) {
            getStore().dispatch({ type: appTypes.setBluetoothLoader, payload: false });
            getStore().dispatch({ type: SET_ERROR_MESSAGE, payload: "Error estableciendo conexion con el candado" });
            console.log("Lo encontramos, pero entramos al cath");
            console.log("error connectToDevice", error);
            this.manager.stopDeviceScan();
            await this.removeDeviceState();
        }
    };

    //disconnect from a device
    disconnectFromDevice = () => {
        if (this.connectedDevice && this.manager) {
            this.manager.cancelDeviceConnection(this.connectedDevice.id)
                .then(() => {
                    console.log(`Disconnected from device: ${this.connectedDevice.id}`);
                    this.connectedDevice.cancelConnection();
                    this.connectedDevice = null;
                })
                .catch(error => {
                    console.log('Error desconectandose del dispositivo', error);
                });
        }
    };

    //CODIGO PARA PANTALLA CHECKLIST
    scanForLock(endTripValidation, mac) {
        this.endTripValidation = endTripValidation;
        this.initProcessVariables();
        this.listener = this.manager.onStateChange(async (state) => {
            console.log("---Listener-----");
            if (state === 'PoweredOn') {
                console.log("BLE encendido");
                this.bluetoothState = true;
            } else if (state === 'PoweredOff') {
                this.stopLockVerification();
            } else {
                this.stopLockVerification();
            }
        }, true);
        this.scanLockChecklist(mac)
    }

    stopLockVerification() {
        this.manager.stopDeviceScan();
        this.bluetoothState = false;
        let keys = ['userInRange', 'lockInRange', 'lockIsClosed'];
        keys.forEach(key => {
            if (this.endTripValidation[key] == "loading") {
                this.endTripValidation[key] = "waiting";
            }
        });
        getStore().dispatch(setEndTripValidation(this.endTripValidation));
        getStore().dispatch(setButtonStartValidation(true));
        this.removeDeviceState();
    }

    async scanLockChecklist(mac) {
        setTimeout(async () => {
            if (this.deviceFound || this.endTripValidation.lockInRange == "yes") {
                console.log("encontramos el candado");
            } else {
                console.log("No encontramos el candado");
                this.endTripValidation.lockInRange = "no";
                this.stopLockVerification();
                getStore().dispatch({ type: SET_ERROR_MESSAGE, payload: "No encontramos la bici cerca de ti" });
            }
        }, 10000);
        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log("Error scan")
            } else {
                if (Platform.OS == 'android') {
                    if (device.id == mac) {
                        console.log("device found", device);
                        this.connectToDeviceCL(device);
                    }
                } else {
                    if (device.localName == "LOCK") {
                        console.log("device found", device);
                        this.connectToDeviceCL(device);
                    }
                }

            }
        });
    }

    async connectToDeviceCL(deviceData) {
        this.deviceFound = true;
        try {
            this.manager.stopDeviceScan();
            setTimeout(async () => {
                if ((this.connectedDevice && this.connectedDevice.id) || this.endTripValidation.lockInRange == "yes") {
                    console.log("Logramos conectarnos al candado");
                } else {
                    console.log("Lo encontramos, pero no logramos conectarnos");
                    this.endTripValidation.lockInRange = "no";
                    this.stopLockVerification();
                    getStore().dispatch({ type: SET_ERROR_MESSAGE, payload: "No encontramos la bici cerca de ti" });
                }
            }, 10000);
            let device = await this.manager.connectToDevice(deviceData.id);

            console.log(`1 Connected to device: ${device.id}`);
            this.connectedDevice = device;
            this.endTripValidation.lockInRange = "yes";
            getStore().dispatch(setEndTripValidation(this.endTripValidation));
            await this.connectedDevice.discoverAllServicesAndCharacteristics();
            const services = await device.services();
            let lockUuids = {
                modelA: {
                    write: "0783b03e-8535-b5a0-7140-a304d2495cba",
                    notify: "0783b03e-8535-b5a0-7140-a304d2495cb8"
                },
                modelC: {
                    write: "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
                    notify: "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
                }
            };
            let lockUuid = lockUuids.modelA;
            this.lockModel = "modelA";
            let mainService = services.find(serv => serv.uuid == "0783b03e-8535-b5a0-7140-a304d2495cb7");
            if (!mainService) {
                mainService = services.find(serv => serv.uuid == "6e400001-b5a3-f393-e0a9-e50e24dcca9e");
                if (mainService) {
                    lockUuid = lockUuids.modelC;
                    this.lockModel = "modelC";
                }
            }
            if (mainService) {
                let characteristics = await mainService.characteristics();
                let notifyCharacteristic = characteristics.find(char => char.uuid == lockUuid.notify);
                this.writeCharacteristic = characteristics.find(char => char.uuid == lockUuid.write);
                if (notifyCharacteristic) {
                    notifyCharacteristic.monitor((error, characteristic) => {
                        if (error) {
                            console.log('error monitor', error);
                        } else {
                            let buff = Buffer.from(characteristic.value, 'base64');
                            this.listenCharValueCL(buff);
                        }
                    });
                }
                if (this.writeCharacteristic) {
                    let data = this.obtainUnlockKeyCommand(this.key);
                    await this.writeCharacteristic.writeWithoutResponse(Buffer.from(new Uint8Array(data)).toString('base64'))
                    setTimeout(async () => {
                        if (this.keyRecieved || this.endTripValidation.lockIsClosed != "loading") {
                            console.log("Si obtuvimos la llave");
                        } else {
                            console.log("Nos conectamos, pero no obtuvimos la llave");
                            this.stopLockVerification();
                            getStore().dispatch({ type: SET_ERROR_MESSAGE, payload: "No podemos verificar estado del candado, intentalo de nuevo" });
                        }
                    }, 10000)
                }
            }
        } catch (error) {
            console.log("error connectToDevice", error);
            this.stopLockVerification();
        }
    }

    decryptDataCL(data) {
        let msg = data.length >= 14 ? data.slice(0, 14) : data.slice(0, 8);
        let crcData = [msg[msg.length - 2], msg[msg.length - 1]];
        let messageEncrypted = msg.slice(0, msg.length - 2);
        let crcCalc = crc16(messageEncrypted);
        let random = msg[1] - 0x32;
        let messageDecrypted = [msg[0], random];
        for (let i = 2; i < msg.length - 2; i++) {
            messageDecrypted.push(msg[i] ^ random);
        }
        return messageDecrypted;
    }

    listenCharValueCL(buffer) {
        let uint8 = new Uint8Array(buffer);
        if (uint8.length > 0 && uint8[0] == 0xfe) {
            let decrypt1 = this.decryptDataCL(uint8);
            if (decrypt1[3] == 0x11) {
                this.keyRecieved = true;
                let keyCom = decrypt1[2];
                let statusCommand = this.buildStatusCommand(keyCom);
                this.writeCharacteristic.writeWithoutResponse(Buffer.from(new Uint8Array(statusCommand)).toString('base64'));
                this.waitUntilLockStatus();
            } else if (decrypt1[3] == 0x31) {
                this.statusCommandState = true;
                this.manager.stopDeviceScan();
                this.removeDeviceState();
                if (decrypt1[5] == 1) {
                    this.endTripValidation.lockIsClosed = "yes";
                } else {
                    this.endTripValidation.lockIsClosed = "no";
                    getStore().dispatch({ type: SET_ERROR_MESSAGE, payload: "Debe cerrar el candado para terminar viaje" });
                }
                getStore().dispatch(setEndTripValidation(this.endTripValidation));
                getStore().dispatch(setButtonStartValidation(true));
            }
        }
    }

    resetLock(mac, id, imei) {
        console.log('Resetting lock', mac, id, imei);
        try { this.manager.stopDeviceScan(); } catch (e) { }
        getStore().dispatch({ type: appTypes.setBluetoothLoader, payload: true });

        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log('Error scan reset', error);
                Alert.alert("Error de Escaneo", "No se pudo iniciar el escaneo de Bluetooth. Asegúrate de tener permisos y Bluetooth encendido.");
                getStore().dispatch({ type: appTypes.setBluetoothLoader, payload: false });
                this.manager.stopDeviceScan();
                return;
            }
            if (device.id === mac || (device.localName && device.localName.includes("LOCK"))) {
                console.log('Device found for reset', device.id, imei);
                this.manager.stopDeviceScan();
                this.connectAndReset(device, imei);
            }
        });
        setTimeout(() => {
            if (!this.deviceFound) {
                this.manager.stopDeviceScan();
                getStore().dispatch({ type: appTypes.setBluetoothLoader, payload: false });
                getStore().dispatch({ type: SET_ERROR_MESSAGE, payload: "No se encontró el candado cerca para resetear" });
            }
        }, 15000);
    }

    async connectAndReset(deviceData, imei) {
        this.deviceFound = true;
        try {
            console.log('=== BINARY RESET PROTOCOL START ===', imei);
            let device = await this.manager.connectToDevice(deviceData.id);
            this.connectedDevice = device;
            await this.connectedDevice.discoverAllServicesAndCharacteristics();
            const services = await device.services();

            let lockUuids = {
                modelA: {
                    write: "0783b03e-8535-b5a0-7140-a304d2495cba",
                    notify: "0783b03e-8535-b5a0-7140-a304d2495cb8",
                    service: "0783b03e-8535-b5a0-7140-a304d2495cb7"
                },
                modelC: {
                    write: "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
                    notify: "6e400003-b5a3-f393-e0a9-e50e24dcca9e",
                    service: "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
                }
            };

            // Detect which model
            let config = lockUuids.modelA;
            this.lockModel = "modelA";
            if (!services.find(s => s.uuid == config.service)) {
                config = lockUuids.modelC;
                this.lockModel = "modelC";
            }
            console.log('Detected model:', this.lockModel);

            // SIMPLIFIED BINARY HANDSHAKE
            await new Promise(async (resolve, reject) => {
                let sessionKey = null;
                const timeout = setTimeout(() => {
                    console.log('Handshake timeout');
                    monitorSub.remove();
                    resolve();
                }, 10000);

                const monitorSub = device.monitorCharacteristicForService(
                    config.service,
                    config.notify,
                    async (error, char) => {
                        if (error) {
                            console.log('Monitor error:', error);
                            return;
                        }

                        const buff = Buffer.from(char.value, 'base64');
                        const uint8 = new Uint8Array(buff);

                        if (uint8.length > 0 && uint8[0] == 0xfe) {
                            const decrypted = this.decryptDataCL(uint8);
                            console.log('RX (decrypted):', arrayToHex(decrypted));

                            // Key received (0x11)
                            if (decrypted[3] == 0x11) {
                                sessionKey = decrypted[2];
                                console.log('✓ Key received:', sessionKey);

                                // 1. Clear unuploaded data (0x52) - Prevents buffer saturation
                                setTimeout(async () => {
                                    const clearCmd = this.sendClearDataCommand(sessionKey);
                                    await device.writeCharacteristicWithoutResponseForService(
                                        config.service,
                                        config.write,
                                        Buffer.from(new Uint8Array(clearCmd)).toString('base64')
                                    );
                                    console.log('TX: 0x52 Clear Data');
                                }, 300);

                                // 2. Send Status Query (0x31) - Ensure sync
                                setTimeout(async () => {
                                    const statusCmd = this.buildStatusCommand(sessionKey);
                                    await device.writeCharacteristicWithoutResponseForService(
                                        config.service,
                                        config.write,
                                        Buffer.from(new Uint8Array(statusCmd)).toString('base64')
                                    );
                                    console.log('TX: 0x31 Status Query');
                                }, 600);

                                // 3. Finally, send Unlock command (0x21) with current timestamp
                                setTimeout(async () => {
                                    const unlockCmd = this.sendUnlockCommand(sessionKey);
                                    await device.writeCharacteristicWithoutResponseForService(
                                        config.service,
                                        config.write,
                                        Buffer.from(new Uint8Array(unlockCmd)).toString('base64')
                                    );
                                    console.log('TX: 0x21 Unlock (Definitive Sync)');
                                }, 1000);
                            }

                            // Unlock response (0x21)
                            if (decrypted[3] == 0x21) {
                                console.log('✓ Unlock response received');
                                setTimeout(() => {
                                    clearTimeout(timeout);
                                    monitorSub.remove();
                                    resolve();
                                }, 1000);
                            }
                        }
                    }
                );

                // Send key request (0x11)
                console.log('TX: 0x11 Key Request');
                const keyReq = this.obtainUnlockKeyCommand(this.key);
                await device.writeCharacteristicWithoutResponseForService(
                    config.service,
                    config.write,
                    Buffer.from(new Uint8Array(keyReq)).toString('base64')
                );
            });

            console.log('=== BINARY RESET PROTOCOL COMPLETE ===');
            Alert.alert("Éxito", "Comando de reset binario enviado.");
            getStore().dispatch({ type: appTypes.setBluetoothLoader, payload: false });
        } catch (err) {
            console.log('Error in connectAndReset binary:', err);
            getStore().dispatch({ type: appTypes.setBluetoothLoader, payload: false });
            Alert.alert("Error", err.message || "Fallo en reset binario");
        } finally {
            if (this.connectedDevice) {
                await this.manager.cancelDeviceConnection(this.connectedDevice.id).catch(() => { });
                this.connectedDevice = null;
            }
        }
    }
    async connectAndOpen5G(mac, imei, id) {
        console.log('--- STARTING 5G LOCK CONNECTION ---');
        console.log('Parameters:', { mac, imei, id });

        // Define lock UUIDs (must be local — not inherited from connectAndReset)
        const lockUuids = {
            modelA: {
                write: "0783b03e-8535-b5a0-7140-a304d2495cba",
                notify: "0783b03e-8535-b5a0-7140-a304d2495cb8",
                service: "0783b03e-8535-b5a0-7140-a304d2495cb7"
            },
            modelC: {
                write: "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
                notify: "6e400003-b5a3-f393-e0a9-e50e24dcca9e",
                service: "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
            }
        };

        this.id = id;
        this.keyRecieved = false;
        this.lockOpened = false;

        // Wait for BLE to be ready before scanning
        try {
            await this.waitForBleReady(8000);
        } catch (bleErr) {
            console.log('[5G BLE] Not ready:', bleErr.message);
            throw bleErr;
        }

        return new Promise(async (resolve, reject) => {
            let connectionTimeout = setTimeout(() => {
                this.manager.stopDeviceScan();
                reject(new Error("No se encontró el candado. Por favor, asegúrate de estar cerca e inténtalo de nuevo."));
            }, 15000);

            console.log("Scanning for:", mac, "or IMEI:", imei);

            this.manager.startDeviceScan(null, null, async (error, device) => {
                if (error) {
                    console.log('Scan error:', error);
                    clearTimeout(connectionTimeout);
                    this.manager.stopDeviceScan();
                    reject(error);
                    return;
                }

                // Check by MAC or Name (which usually contains IMEI)
                if (device.address === mac || device.id === mac || (device.name && device.name.includes(imei))) {
                    console.log('✓ Device found:', device.name, device.id);
                    clearTimeout(connectionTimeout);
                    this.manager.stopDeviceScan();

                    try {
                        const connectedDevice = await device.connect();
                        this.connectedDevice = connectedDevice;
                        await connectedDevice.discoverAllServicesAndCharacteristics();

                        const services = await connectedDevice.services();
                        let config = lockUuids.modelA;
                        this.lockModel = "modelA";

                        if (!services.find(s => s.uuid == config.service)) {
                            config = lockUuids.modelC;
                            this.lockModel = "modelC";
                        }
                        console.log('Detected model:', this.lockModel);

                        let sessionKey = null;
                        let monitorSub = null;

                        const handshakeTimeout = setTimeout(async () => {
                            if (monitorSub) monitorSub.remove();
                            // Ensure disconnection on handshake timeout
                            if (this.connectedDevice) {
                                await this.manager.cancelDeviceConnection(this.connectedDevice.id).catch(() => { });
                                this.connectedDevice = null;
                            }
                            reject(new Error("Tiempo de espera agotado durante el apretón de manos con el candado."));
                        }, 15000);

                        monitorSub = connectedDevice.monitorCharacteristicForService(
                            config.service,
                            config.notify,
                            async (error, char) => {
                                if (error) {
                                    console.log('Monitor error:', error);
                                    return;
                                }

                                const buff = Buffer.from(char.value, 'base64');
                                const uint8 = new Uint8Array(buff);

                                if (uint8.length > 0 && uint8[0] == 0xfe) {
                                    const decrypted = this.decryptDataCL(uint8);
                                    console.log('RX (decrypted):', arrayToHex(decrypted));

                                    // Key received (0x11)
                                    if (decrypted[3] == 0x11) {
                                        sessionKey = decrypted[2];
                                        this.keyRecieved = true;
                                        console.log('✓ Key received:', sessionKey);

                                        // 1. Clear unuploaded data (0x52) - Prevents buffer saturation (MATCHING WORKING LOGIC)
                                        setTimeout(async () => {
                                            if (!this.connectedDevice) return;
                                            const clearCmd = this.sendClearDataCommand(sessionKey);
                                            await connectedDevice.writeCharacteristicWithoutResponseForService(
                                                config.service,
                                                config.write,
                                                Buffer.from(new Uint8Array(clearCmd)).toString('base64')
                                            );
                                            console.log('TX: 0x52 Clear Data');
                                        }, 300);

                                        // 2. Send Status Query (0x31) - Ensure sync (MATCHING WORKING LOGIC)
                                        setTimeout(async () => {
                                            if (!this.connectedDevice) return;
                                            const statusCmd = this.buildStatusCommand(sessionKey);
                                            await connectedDevice.writeCharacteristicWithoutResponseForService(
                                                config.service,
                                                config.write,
                                                Buffer.from(new Uint8Array(statusCmd)).toString('base64')
                                            );
                                            console.log('TX: 0x31 Status Query');
                                        }, 600);

                                        // 3. Finally, send Unlock command (0x21) (MATCHING WORKING LOGIC)
                                        setTimeout(async () => {
                                            if (!this.connectedDevice) return;
                                            const unlockCmd = this.sendUnlockCommand(sessionKey);
                                            await connectedDevice.writeCharacteristicWithoutResponseForService(
                                                config.service,
                                                config.write,
                                                Buffer.from(new Uint8Array(unlockCmd)).toString('base64')
                                            );
                                            console.log('TX: 0x21 Unlock (Definitive Sync)');
                                        }, 1000);
                                    }

                                    // Unlock response (0x21)
                                    if (decrypted[3] == 0x21) {
                                        console.log('✓ Unlock success response received');
                                        clearTimeout(handshakeTimeout);
                                        monitorSub.remove();
                                        this.lockOpened = true;

                                        // CRITICAL: Wait 2 seconds for lock to physically move then disconnect
                                        setTimeout(async () => {
                                            if (this.connectedDevice) {
                                                console.log('🏁 Disconnecting after success');
                                                await this.manager.cancelDeviceConnection(this.connectedDevice.id).catch(() => { });
                                                this.connectedDevice = null;
                                            }
                                            resolve({ success: true, model: this.lockModel });
                                        }, 2000);
                                    }
                                }
                            }
                        );

                        // 4. Start handshake with Key Requests - Sequentially try different keys
                        const keysToTry = [
                            this.key, // Model A: "cxNOs4Zg"
                            "TA7aCRHe", // Model C (used in original service)
                            "12345678"  // Potential Model B fallback
                        ];

                        let keyIndex = 0;
                        const sendNextKeyRequest = async () => {
                            if (this.keyRecieved || !this.connectedDevice) return;

                            if (keyIndex < keysToTry.length) {
                                const currentKey = keysToTry[keyIndex];
                                console.log(`TX: 0x11 Key Request (Attempt ${keyIndex + 1}: ${currentKey})`);
                                let keyReq = this.obtainUnlockKeyCommand(currentKey);
                                await connectedDevice.writeCharacteristicWithoutResponseForService(
                                    config.service,
                                    config.write,
                                    Buffer.from(new Uint8Array(keyReq)).toString('base64')
                                );
                                keyIndex++;

                                // Schedule next attempt if this one fails (4s timeout)
                                setTimeout(sendNextKeyRequest, 4000);
                            } else {
                                console.warn('❌ Exhausted all known keys for handshake');
                            }
                        };

                        // Initial attempt
                        await sendNextKeyRequest();

                    } catch (err) {
                        console.log('Connection error:', err);
                        if (this.connectedDevice) {
                            await this.manager.cancelDeviceConnection(this.connectedDevice.id).catch(() => { });
                            this.connectedDevice = null;
                        }
                        reject(err);
                    }
                }
            });
        });
    }
}

const service = new BluetoothService();
export { service as bluetooth };
