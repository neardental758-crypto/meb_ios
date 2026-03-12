import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Cronometro(props){ 
    const { iniciar, finalizar } = props;
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (iniciar) {
            console.log('iniciando cronometro');
            startTimer();
        }
    }, [iniciar])

    useEffect(() => {
        if (finalizar) {
            console.log('finalizar cronometro');
            resetTimer();
        }
    }, [finalizar])

    useEffect(() => {
        const loadTime = async () => {
        try {
            const storedTime = await AsyncStorage.getItem('time');
            const storedStartDate = await AsyncStorage.getItem('startDate');

            if (storedTime !== null && storedStartDate !== null) {
            const elapsedTime = Math.floor((Date.now() - new Date(storedStartDate).getTime()) / 1000);
            setTime(parseInt(storedTime) + elapsedTime);
            setIsRunning(true);
            startTimer();
            }
        } catch (e) {
            console.log(e);
        }
        };

        loadTime();
    }, []);

    useEffect(() => {
        if (isRunning) {
        AsyncStorage.setItem('time', time.toString());
        AsyncStorage.setItem('startDate', new Date().toISOString());
        }
    }, [isRunning, time]);

    const startTimer = () => {
        if (!isRunning) {
        setIsRunning(true);
        timerRef.current = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);
        }
    };

    const stopTimer = () => {
        if (isRunning) {
        clearInterval(timerRef.current);
        setIsRunning(false);
        }
    };

    const resetTimer = async () => {
        await clearInterval(timerRef.current);
        await setTime(0);
        await setIsRunning(false);
        await AsyncStorage.removeItem('time');
        await AsyncStorage.removeItem('startDate');
    };

    const formatTime = (seconds) => {
        const getSeconds = `0${seconds % 60}`.slice(-2);
        const minutes = Math.floor(seconds / 60);
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
        return `${getHours}:${getMinutes}:${getSeconds}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Tiempo</Text>
            <Text style={styles.timer}>{formatTime(time)}</Text>
            {/*<Button title={isRunning ? "Detener" : "Iniciar"} onPress={isRunning ? stopTimer : startTimer} />
            <Button title="Reiniciar" onPress={resetTimer} />*/}
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    color: 'white'
  },
  timer: {
    fontSize: 14,
    color: 'white'
  },
});
