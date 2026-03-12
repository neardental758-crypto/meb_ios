
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function DataUser(){
    const [ state , setState ] = useState({
        dataCargada: false,
    });

    const [ crono , setCrono ] = useState({
        dataCronoCargada: false,
        CronometroStorageVP: {
            segundos: 0,
            minutos: 0,
            horas : 0,
            latAct: 0,
            lngActual: 0
        }
    });
    
    const cargarDataUsuario = () => { 
        AsyncStorage.getItem('user').then((res) => {
            if (res !== null) {
                console.log( 'objeto userRegistro',{res: JSON.parse(res) } );
                setState({ 
                    ...state,
                    dataCargada: true,  
                    DataUser: JSON.parse(res) 
                });
            }
        })
    }

    const cargarDataposicionInicial = () => { 
        AsyncStorage.getItem('cronometroVP').then((res) => {
            if (res !== null) {
                console.log( 'objeto cronometro VP',{res: JSON.parse(res) } );
                setCrono({ 
                    dataCronoCargada: true,
                    CronometroStorageVP: JSON.parse(res) 
                });
            }
        })
    }
    
    useEffect(() => {
        cargarDataUsuario()
        cargarDataposicionInicial()
    },[])

    return state;
}







