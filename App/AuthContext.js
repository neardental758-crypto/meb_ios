import React, { createContext, useState, useEffect} from 'react';
import { getItem, setItem } from '../Services/storage.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken } from './Services/refresh.service';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [ isLogin , setIsLogin ] = useState(false);
    const [ token , setToken ] = useState(null);
    const [ infoUser , setInfoUser ] = useState(null);

    const [ posicionInicial , setposicionInicial ] = useState({
        dataCronoCargada: false,
        CronometroStorageVP: {
            latInicial: 0,
            lngInicial: 0
        }
    });

    const [ tiempoSegundoPlanoVP , setTiempoSegundoPlanoVP ] = useState({
        tiempoSPcargado: false,
        tiempoVP: {
            minutos: 0
        }
    });

    const dataUser = async () => {
        await AsyncStorage.getItem('token').then((res) => {
            if (res !== null) {
                setToken(res);
                refreshToken();
                setIsLogin(true);
            }
        })
    }

    const dataUser2 = async () => {
        await AsyncStorage.getItem('user')
        .then((res) => {
            if (res !== null) {
                setInfoUser({  
                    DataUser: JSON.parse(res) 
                });
            }
        })
    }

    const cargarDataposicionInicial = async () => { 
        await AsyncStorage.getItem('posicionInicial').then((res) => {
            if (res !== null) {
                setTiempoSegundoPlanoVP({ 
                    dataCronoCargada: true,
                    CronometroStorageVP: JSON.parse(res) 
                });
            }
        })
    }

    const cargarDataTiempoVP = async () => { 
        await AsyncStorage.getItem('tiempoSegundoPlanoVP').then((res) => {
            if (res !== null) {
                setTiempoSegundoPlanoVP({ 
                    tiempoSPcargado: true,
                    tiempoVP: JSON.parse(res) 
                });
            }
        })
    }

    const logout = async() => {
        console.log('cerrando sesion')
        await AsyncStorage.multiRemove([
            'rutaCoordinates',
            'vehiculoVP',
            'distanciaRecorrida',
            'elapsedTime',
            'isTrackingActive',
            'posicionInicial',
            'lastAppCloseTime',
            'user'
        ])
        await AsyncStorage.clear();
        await setIsLogin(false);
        await setInfoUser(null);
        await setToken(null);
    }

    const logoutOut = async() => {
        //console.log('cerrando sesion Out')
        await AsyncStorage.removeItem('user2');
        await AsyncStorage.removeItem('tokenOut');
        await setIsLogin(false);
        await setInfoUser(null);
        await setToken(null);
    }

    const endTtripVP = async () => {
        await AsyncStorage.removeItem('miPosicionVP');
        await AsyncStorage.removeItem('viajeVPactivo');
        await AsyncStorage.removeItem('posicionInicial');
        await AsyncStorage.removeItem('tiempoSegundoPlanoVP');
        await AsyncStorage.removeItem('rutaCoordinates');
        await AsyncStorage.removeItem('distanciaRecorrida');
    }

    useEffect(() => {
        dataUser();
        dataUser2();
    },[token !== null])

    useEffect(() => {
        dataUser2();
    },[])

    return (
        <AuthContext.Provider value={{
            isLogin, 
            token, 
            infoUser, 
            posicionInicial, 
            tiempoSegundoPlanoVP,
            dataUser, 
            dataUser2, 
            logout, 
            logoutOut,
            endTtripVP, 
            cargarDataposicionInicial,
            cargarDataTiempoVP,
        }}>{children}</AuthContext.Provider>
    )
}