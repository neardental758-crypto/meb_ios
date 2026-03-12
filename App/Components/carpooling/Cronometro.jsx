import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef
} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Cronometro = forwardRef((props, ref) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Exponer métodos al componente padre
  useImperativeHandle(ref, () => ({
    iniciar,
    finalizar
  }));

  // Función para iniciar el cronómetro
  const iniciar = async () => {
    if (isRunning) return;
    const startDate = new Date().toISOString();
    await AsyncStorage.setItem('startDate', startDate);
    timerRef.current = setInterval(() => {
      setTime((prev) => {
        const updated = prev + 1;
        AsyncStorage.setItem('time', updated.toString());
        return updated;
      });
    }, 1000);
    setIsRunning(true);
  };

  // Función para detener el cronómetro
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  };

  // Función para reiniciar el cronómetro
  const finalizar = async () => {
    stopTimer();
    setTime(0);
    await AsyncStorage.removeItem('time');
    await AsyncStorage.removeItem('startDate');
  };

  // Cargar el tiempo si se cierra la app y vuelve
  useEffect(() => {
    const loadTime = async () => {
      const storedTime = await AsyncStorage.getItem('time');
      const storedStartDate = await AsyncStorage.getItem('startDate');
      if (storedStartDate) {
        const elapsed = Math.floor((Date.now() - new Date(storedStartDate).getTime()) / 1000);
        setTime(elapsed);
      }
    };
  
    loadTime();
    return stopTimer;
  }, []);

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
    </View>
  );
});

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
