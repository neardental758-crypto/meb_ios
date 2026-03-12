import React, { useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import VersionCheck from 'react-native-version-check';
import NetInfo from '@react-native-community/netinfo';
import { Env } from "../Utils/enviroments";
const URLMysql = Env.apiUrlMysql;

const isVersionOlder = (current, minimum) => {
  const currentParts = current.split('.').map(Number);
  const minimumParts = minimum.split('.').map(Number);

  for (let i = 0; i < Math.max(currentParts.length, minimumParts.length); i++) {
    const cur = currentParts[i] || 0;
    const min = minimumParts[i] || 0;
    if (cur < min) return true;
    if (cur > min) return false;
  }
  return false;
};

const UpdateChecker = () => {
  useEffect(() => {
    const checkVersion = async () => {
      // Verificar conexión antes de hacer fetch
      const netState = await NetInfo.fetch();

      if (!netState.isConnected) {
        Alert.alert(
          "Sin conexión",
          "No tienes conexión a internet. La funcionalidad de verificación de actualización no está disponible."
        );
        return;
      }

      try {
        let tabla = 'bc_versiones_app/nombre_app/meb';
        let url = URLMysql + tabla;
        const response = await fetch(url);
        const textResponse = await response.text();

        let data;
        try {
          // Intentamos convertir a JSON de forma segura
          const parsedJson = JSON.parse(textResponse);
          data = parsedJson.data;
        } catch (parseError) {
          // Si es un String de error (ej: "ERROR_GET_VERSIONES_APP") o HTML (404), ignoramos silenciosamente
          console.warn('⚠️ La API no devolvió un JSON en UpdateChecker. Ignorando actualización. Respuesta:', textResponse.substring(0, 100));
          return; // Salimos de la función sin crashear la app
        }

        // Si no hay data válida en el JSON, salimos
        if (!data) return;

        const currentVersion = VersionCheck.getCurrentVersion();
        const minVersion = Platform.OS === 'android'
          ? data.ultima_version_android
          : data.ultima_version_ios;

        if (isVersionOlder(currentVersion, minVersion)) {
          Alert.alert(
            'Actualización requerida',
            `⚠️ Tu versión es ${currentVersion} y la mínima permitida es ${minVersion}. Por favor actualiza la app.`,
            [
              {
                text: 'Actualizar ahora',
                onPress: async () => {
                  const storeUrl = Platform.OS === 'android'
                    ? await VersionCheck.getPlayStoreUrl({ packageName: 'com.mejorenbici2025' })
                    : await VersionCheck.getAppStoreUrl({ appID: '6468495655' });

                  Linking.openURL(storeUrl);
                }
              },
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        console.error('Error verificando actualización:', error);
      }
    };

    checkVersion();
  }, []);

  return null;
};

export default UpdateChecker;
