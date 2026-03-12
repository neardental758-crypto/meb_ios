import React from 'react';
import { BleManager } from 'react-native-ble-plx';
import { Alert, Platform } from "react-native";
import { appActions } from '../actions/actions';
import { setButtonStartValidation, setEndTripValidation } from '../actions/rideActions';
import { appTypes } from '../types/types';
global.Buffer = global.Buffer || require('buffer').Buffer;
import { api } from '../api/api.service';
import configure from './configure';
import { SET_ERROR_MESSAGE, START_TRIP } from '../types/rideTypes';
import { CONFIRM_BLE_OPENED, SET_STATUS_LOCK, VERIFY_LOCK_STATUS_TRIP } from '../types/tripTypes';
let keyComunication = 0x11;
let randomNumber = 0x34;

let store = configure;

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

function getTimeStampBytes(){
  var date = Date.now();
  console.log('Date.now()',date);
  var bytes = new Array();
  for (i = 0; i < 4; i++) {
      bytes[i] = (date >> (8*i)) & 0xff;
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
        this.connectedDevice = null;
        this.state = null;
        this.manager = new BleManager();
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

    initProcessVariables(){
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

    waitUntilDeviceState(uuid, id) {
        //Alert.alert("entrando a waitUntilDevice");
        this.id = id;
        this.initProcessVariables(); 
        //Alert.alert("en wait until device id " + this.id);
        //Alert.alert("en wait until device id " + id);
        
        this.scanForDevices(uuid, id);  
        this.listener = this.manager.onStateChange(async (state) => {
            console.log("---Listener-----");
            if (state === 'PoweredOn') {
                //console.log("encendido");

                //Alert.alert("encendido");              
                this.bluetoothState = true;
                this.scanForDevices(uuid, id);  
            } else if (state === 'PoweredOff') {
                //TODO: No pude con el timeout verificar si paso x tiempo y tiene el bluetooth encendido... pues entonces hagamoslo cuando este apagado, 
                //toda la logica de desconectar y parar hacerla aca, es mas facil y mas escalable
                console.log("se apago pues cierra este candado", this.id);
                Alert.alert("bluetooth apagado");
                configure.dispatch({ type: appTypes.setBluetoothLoader, payload: false });
                configure.dispatch({ type: SET_ERROR_MESSAGE, payload: "Apagaste el bluetooth mientras estabas en el proceso de abrir el candado, por favor vuelve a intentarlo" });                    
                let changeLock = {
                    lockStatus: "closed"
                };        
                await api.patchField("locks", this.id, changeLock);                
                this.manager.stopDeviceScan();                
                await this.removeDeviceState();
                
            } else {
                this.bluetoothState = false;
                console.log("errors")
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

    async scanForDevices(id, idLock) {
        //let postUuid = yield api.scanUuid(id);
        //scanUuid(id)
        //api.scanUuid(id);
        //Alert.alert("en la funcion scan for devices");
        setTimeout(async () => {                
                if(this.deviceFound){
                    console.log("encontramos el candado");
                    //Alert.alert("encontramos el candado");
                }else{
                    try {
                       
                        //await api.scanUuid(idLock,id);
                        //Alert.alert("En la función scanUuid");
                    } catch (error) {
                        //Alert.alert("Error en scanUuid:");
                    }
                    //await api.scanUuid(id);
                    configure.dispatch({ type: appTypes.setBluetoothLoader, payload: false });
                    configure.dispatch({ type: SET_ERROR_MESSAGE, payload: "No encontramos el candado en los dispositivos cercanos" }); 
                    console.log("id---->" + device.id);                   
                    console.log("No encontramos el candado");
                    //Alert.alert("No encontramos el candado " + this.deviceFound);
                    //Alert.alert("mac: " + uuid);
                    //Alert.alert("id:------> " + device.id);
                    this.manager.stopDeviceScan();
                    await this.removeDeviceState();
                }
            }, 10000);
        this.manager.startDeviceScan(null, null, async (error, device) => {
            if (error) {
               
                //Alert.alert("Error scan");
                console.log("device  " + device);
               
            } else {
                console.log("device");
               //Alert.alert("device");           
                if(Platform.OS == 'ios'){
                    try {
                        //Alert.alert("valor del idLock " + idLock);
                        await api.scanUuid(idLock,device.id);
                        //Alert.alert("En la función scanUuid");
                    } catch (error) {
                        //Alert.alert("Error en scanUuid:");
                    }
                    //device.connect();
                    //Alert.alert("Añadiendo el uuid ");
                  
                   console.log("este es el device " + device);
                    if (device.id == id) {
                        //console.log("device found", device);
                        Alert.alert("entro al condicional por id ");
                        this.connectToDevice(device);
                    }
                    
                    else if(device.localName == "LOCK"){
                        //Alert.alert("entrando a device.name");
                       
                        //Alert.alert("device.id: " + device.id);
                        this.connectToDevice(device);
                    }
                    else if(device.id == null){
                        //Alert.alert("device.id es nulo");
                        console.log("device nulo " + device)
                        this.connectToDevice(device);
                    }    
                }else{
                    this.connectToDevice(device);
                    if (device.localName == "LOCK") {
                        console.log("device found", device);
                        //Alert.alert("device found lock")
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
        arrayData[1] = randomNumber;
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

    waitUntilLockOpened(){
      setTimeout(async () => {          
          if(this.openedCommandState){
              console.log("El candado abrio, bien!");
              this.removeDeviceState();
          }else{
              configure.dispatch({ type: appTypes.setBluetoothLoader, payload: false });
              configure.dispatch({ type: SET_ERROR_MESSAGE, payload: "El candado no abrio por medio de bluetooth, contacta soporte (timeStamp)" });                    
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
              console.log("this.lockModel",this.lockModel);
              if(this.lockModel=="modelC"){
                if(decrypt1[5] == 0x00){
                  this.confirmLockOpen();  
                }else{
                  console.log("No abrio candado tipo C");
                }
              }else{
                this.confirmLockOpen();                
              }                      
            }
        } else {
            //the lock doesnt open, this is a issue with the lock, close the loader, set lockState to closed and return an Alert to the user                                    
            console.log("empty response");
        }
    }

    async confirmLockOpen(){
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

      let statusLock = {
        id: this.id,
        mac: this.mac,
        lockStatus: "closed"
      };
      configure.dispatch({ type: appTypes.setBluetoothLoader, payload: false });
      configure.dispatch({type: SET_STATUS_LOCK, statusLock: statusLock});   
      configure.dispatch({type: CONFIRM_BLE_OPENED});   
      //configure.dispatch({ type: START_TRIP });


    }

    unlockConfirmationCommand(key) {
        let arrayData = [];
        //index 0
        arrayData.push(0xfe);
        //index 1
        arrayData.push(0x29);//Random number
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
        let arrayData = [0xfe, 0x39, key, 0x21, 0x08];
        let userId = [0x02, 0x00, 0x09, 0x09];
        arrayData = arrayData.concat(userId);
        let timeStamp = getTimeStampBytes();
        arrayData = arrayData.concat(timeStamp);
        if (this.lockModel == "modelC"){
          arrayData[4]= 0x09;
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

    buildStatusCommand(key){
      let arrayData = [0xfe,0x37,key,0x31,0x00];
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
    probarOtraClave(){
        ////////// codigo add //////////////////////////////////
        if (this.writeCharacteristic) {
            let data = this.obtainUnlockKeyCommand('TA7aCRHe');
            console.log("key command", data)
            this.writeCharacteristic.writeWithoutResponse(Buffer.from(new Uint8Array(data)).toString('base64'))
            setTimeout(async () => {                        
                 if (this.keyRecieved) {
                   console.log("Si obtuvimos la llave");                    
                 }else{
                   configure.dispatch({ type: appTypes.setBluetoothLoader, payload: false });
                   configure.dispatch({ type: SET_ERROR_MESSAGE, payload: "No fue posible crear una comunicacion estable con el candado. Acercate al candado e intentalo de nuevo" });                    
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
                }else{
                  configure.dispatch({ type: appTypes.setBluetoothLoader, payload: false });
                  configure.dispatch({ type: SET_ERROR_MESSAGE, payload: "No fue posible establecer conexion bluetooth con el candado" });                    
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
                modelA:{
                    write:"0783b03e-8535-b5a0-7140-a304d2495cba",
                    notify:"0783b03e-8535-b5a0-7140-a304d2495cb8"
                },
                modelC:{
                    write:"6e400002-b5a3-f393-e0a9-e50e24dcca9e",
                    notify:"6e400003-b5a3-f393-e0a9-e50e24dcca9e"
                }
            };
            let lockUuid = lockTypes.modelA;
            this.lockModel = "modelA";
            //Buscar servicio principal
            let mainService = services.find(serv => {
                return serv.uuid == "0783b03e-8535-b5a0-7140-a304d2495cb7";
            });

            if(!mainService){
               //Try for model C
              mainService = services.find(serv => {
                  return serv.uuid == "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
              });
              if(mainService){
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
                            console.log('error monitor',error);
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
                         }else{
                           /*configure.dispatch({ type: appTypes.setBluetoothLoader, payload: false });
                           configure.dispatch({ type: SET_ERROR_MESSAGE, payload: "No fue posible crear una comunicacion estable con el candado. Acercate al candado e intentalo de nuevo" });                    
                           console.log("Nos conectamos, pero no obtuvimos la llave");
                           this.manager.stopDeviceScan();
                           await this.removeDeviceState();*/
                           this.probarOtraClave()
                         }
                     }, 10000)
                }
            }
        } catch (error) {            
            configure.dispatch({ type: appTypes.setBluetoothLoader, payload: false });
            configure.dispatch({ type: SET_ERROR_MESSAGE, payload: "Error estableciendo conexion con el candado" });                    
            console.log("Lo encontramos, pero entramos al cath");
            console.log("error connectToDevice" ,error);
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
                    console.log('Error desconectandose del dispositivo',error);
                });
        }
    };

   //CODIGO PARA PANTALLA CHECKLIST
   scanForLock(endTripValidation,mac){
      this.endTripValidation = endTripValidation;
      this.initProcessVariables();
      this.listener = this.manager.onStateChange(async (state) => {
         console.log("---Listener-----");
         if(state === 'PoweredOn') {
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

   stopLockVerification(){
      this.manager.stopDeviceScan();                
       this.bluetoothState = false;
       let keys = ['userInRange','lockInRange','lockIsClosed'];
       keys.forEach(key=>{
         if(this.endTripValidation[key] == "loading"){
           this.endTripValidation[key] = "waiting";
         }
       });             
       configure.dispatch(setEndTripValidation(this.endTripValidation));
       configure.dispatch(setButtonStartValidation(true));                
       this.removeDeviceState();
   }

   async scanLockChecklist(mac) {
        setTimeout(async () => {                
                if(this.deviceFound || this.endTripValidation.lockInRange == "yes"){
                    console.log("encontramos el candado");
                }else{                    
                    console.log("No encontramos el candado");
                    this.endTripValidation.lockInRange = "no";
                    this.stopLockVerification();
                    configure.dispatch({ type: SET_ERROR_MESSAGE, payload: "No encontramos la bici cerca de ti" }); 
                }
            }, 10000);
        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log("Error scan")
                Alert.alert("Error Scan");
            } else {
                console.log("device",device);                
                if(Platform.OS == 'ios'){
                    if (device.id == mac) {
                        console.log("device found", device);
                        this.connectToDeviceCL(device);
                    }    
                }else{
                    if (device.localName == "LOCK") {
                        console.log("device found", device);
                        this.connectToDeviceCL(device);
                    }
                }
                
            }
        });
    };

    async connectToDeviceCL(deviceData) {
      this.deviceFound = true;
        try {
            //comment all this method
            this.manager.stopDeviceScan();
            setTimeout(async () => {               
                if ((this.connectedDevice && this.connectedDevice.id)|| this.endTripValidation.lockInRange == "yes") {
                  console.log("Logramos conectarnos al candado");                    
                }else{                  
                  console.log("Lo encontramos, pero no logramos conectarnos");
                  this.endTripValidation.lockInRange = "no";
                  this.stopLockVerification();
                  configure.dispatch({ type: SET_ERROR_MESSAGE, payload: "No encontramos la bici cerca de ti" }); 
                }
            }, 10000);
            let device = await this.manager.connectToDevice(deviceData.id);
            
            console.log(`1 Connected to device: ${device.id}`);
            this.connectedDevice = device;
            //El candado esta en el rango
            this.endTripValidation.lockInRange = "yes";
            configure.dispatch(setEndTripValidation(this.endTripValidation));
            await this.connectedDevice.discoverAllServicesAndCharacteristics();
            const services = await device.services();
            let lockTypes = {
                modelA:{
                    write:"0783b03e-8535-b5a0-7140-a304d2495cba",
                    notify:"0783b03e-8535-b5a0-7140-a304d2495cb8"
                },
                modelC:{
                    write:"6e400002-b5a3-f393-e0a9-e50e24dcca9e",
                    notify:"6e400003-b5a3-f393-e0a9-e50e24dcca9e"
                }
            };
            let lockUuid = lockTypes.modelA;
            this.lockModel = "modelA";
            let mainService = services.find(serv => {
                return serv.uuid == "0783b03e-8535-b5a0-7140-a304d2495cb7";
            });
            if(!mainService){
               //Try for model C
              mainService = services.find(serv => {
                  return serv.uuid == "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
              });
              if(mainService){
                lockUuid = lockTypes.modelC;
                this.lockModel = "modelC";
              } 
            }
            console.log("Servicios",{services,mainService})
            if (mainService) {
              console.log("this.lockModel", this.lockModel);                
                let characteristics = await mainService.characteristics();                
                let notifyCharacteristic = characteristics.find(char => {
                  return char.uuid == lockUuid.notify;
                    //return char.uuid == "0783b03e-8535-b5a0-7140-a304d2495cb8";
                });                
                this.writeCharacteristic = characteristics.find(char => {
                  return char.uuid == lockUuid.write;
                    //return char.uuid == "0783b03e-8535-b5a0-7140-a304d2495cba";
                });
                this.deviceChar = characteristics;
                console.log("Caracteristicas status",{characteristics,notifyCharacteristic,writeChar:this.writeCharacteristic});
                if (notifyCharacteristic) {                    
                    notifyCharacteristic.monitor((error, characteristic) => {
                        console.log("monitor", characteristic)
                        if (error) {                            
                            console.log('error monitor',error);
                        } else {
                            let buff = Buffer.from(characteristic.value, 'base64');
                            this.listenCharValueCL(buff);
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
                         }else{
                           /*configure.dispatch({ type: appTypes.setBluetoothLoader, payload: false });
                           configure.dispatch({ type: SET_ERROR_MESSAGE, payload: "No fue posible crear una comunicacion estable con el candado. Acercate al candado e intentalo de nuevo" });                    
                           console.log("Nos conectamos, pero no obtuvimos la llave");
                           this.manager.stopDeviceScan();
                           await this.removeDeviceState();*/
                           this.probarOtraClave()
                         }
                     }, 10000)
                }
            }
        } catch (error) {                        
            console.log("error connectToDevice" ,error);
            this.stopLockVerification();
        }
   };

   decryptDataCL(date) {
        let data;
        if (date.length >= 14) {
            data = date.slice(0, 14);
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

   listenCharValueCL(buffer){
      let uint8 = new Uint8Array(buffer);
      console.log("Hex uint8", uint8);
      if (uint8.length > 0 && uint8[0] == 0xfe) {
         let decrypt1 = this.decryptDataCL(uint8);         
         console.log("Hex mensaje recibido", arrayToHex(decrypt1));
         if (decrypt1[3] == 0x11) {
             console.log("recibimos llave, ahora abramos el candado");
             this.keyRecieved = true;
             keyComunication = decrypt1[2];
             //enviar aca comando de status
             let statusCommand = this.buildStatusCommand(keyComunication);
             this.writeCharacteristic.writeWithoutResponse(Buffer.from(new Uint8Array(statusCommand)).toString('base64')).then(resWrite => {

             });
             this.waitUntilLockStatus();
         } else if (decrypt1[3] == 0x31) {
            //En este caso no vamos a abrir el candado
            this.statusCommandState = true;
            console.log("llego status candado, GREAT!");
            this.manager.stopDeviceScan();
            this.removeDeviceState();
            if(decrypt1[5] == 1){
               //Candado cerrado
               this.endTripValidation.lockIsClosed = "yes";
               configure.dispatch(setEndTripValidation(this.endTripValidation));               
               configure.dispatch(setButtonStartValidation(true));
               setTimeout(async () => {  
                  console.log("la prueba de felipe");
                  configure.dispatch(setButtonStartValidation(false));
               }, 80);  
            }else {
               //Candado abierto
               this.endTripValidation.lockIsClosed = "no";
               configure.dispatch(setEndTripValidation(this.endTripValidation));
               configure.dispatch(setButtonStartValidation(true));
               configure.dispatch({ type: SET_ERROR_MESSAGE, payload: "Debe cerrar el candado para terminar viaje" }); 
            }  
                     
         }
      } else {
         //the lock doesnt open, this is a issue with the lock, close the loader, set lockState to closed and return an Alert to the user                                    
         console.log("empty response");
      }

   }

   endLockVerification(){
       this.manager.stopDeviceScan();                
       /*
       this.bluetoothState = false;
       let keys = ['userInRange','lockInRange','lockIsClosed'];
       keys.forEach(key=>{
         if(this.endTripValidation[key] == "loading"){
           this.endTripValidation[key] = "waiting";
         }
       });             
       */
       configure.dispatch(setEndTripValidation(this.endTripValidation));
       configure.dispatch(setButtonStartValidation(true));                
       this.removeDeviceState();
   }

   waitUntilLockStatus(){
      setTimeout(async () => {          
          if(this.statusCommandState || this.endTripValidation.lockIsClosed != "loading"){
              console.log("El candado envio status, bien!");
              this.removeDeviceState();
          }else{                            
              console.log("Obtuvimos key, pero candado no llego status");
              this.stopLockVerification();
              configure.dispatch({ type: SET_ERROR_MESSAGE, payload: "No podemos verificar estado del candado, intentalo de nuevo" });               
          }
      }, 10000);
   }

}