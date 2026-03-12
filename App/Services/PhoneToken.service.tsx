//import StorageService from './storage.service';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {setTokenToUser} from '../api/api.service';

export class PhoneTokenService {
  static async updatePhoneToken(isForced = false): Promise<boolean> {
    return PhoneTokenService.syncPhoneToken(isForced);
  }

  private static async syncPhoneToken(isForced = false): Promise<boolean> {
    console.log('syncPhoneToken entramos aca', isForced);
    if (isForced) {
      try {
        //const userID = await StorageService.getUserID();
        //const phoneToken = await PhoneTokenService.getToken();
        console.log('Haciendo esto ::::::: ');
        /*if (!phoneToken) {
            console.log(phoneToken);
          //console.error('There was an error while getting the phone token');
          return false;
        }
        setTokenToUser(phoneToken).then((response)=>{
          if (response.error != null) {
            console.log('Could not update phone token');
            return false;
          }
        }).catch((err)=>{
          console.log("Error catch "+err);
        });*/
        return true;
      } catch (e) {
        //console.error('There was an error while updating the phone token');
        console.log(e);
        console.log('que paso aca gggggggggggg::::::::::', e);
      }
    }

    return false;
  }

  static async getToken() {
    let permission = await PhoneTokenService.checkPermission()
  if (!permission) {
    if (!(await PhoneTokenService.requestPermission())) {
      return false;
    }
  }

  return await firebase.messaging().getToken();
}

  private static async requestPermission() {
    let permissionsWereGranted = false;
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        permissionsWereGranted = true;
        PhoneTokenService.updatePhoneToken(true);
        console.warn('Permission were accepted');
      })
      .catch(error => {
        console.warn('Permission were rejected');
        console.warn(error);
      });

    return permissionsWereGranted;
  }

  private static checkPermission() {
    return messaging().hasPermission();
  }

  private static async hasPhoneTokenChanged() {
    const phoneToken = await PhoneTokenService.getToken();
    //const storedToken = await StorageService.getFMCPhoneToken();
    //return phoneToken !== storedToken;
  }
}
