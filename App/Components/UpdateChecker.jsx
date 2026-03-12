import React, { useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import VersionCheck from 'react-native-version-check';
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
      try {
        let tabla = 'bc_versiones_app/nombre_app/meb';
        let url = URLMysql + tabla;
        const response = await fetch(url);
        const { data } = await response.json();

        console.log('LA DATA DE VERSION:', data);

        const currentVersion = VersionCheck.getCurrentVersion();
        const minVersion = Platform.OS === 'android'
          ? data.ultima_version_android
          : data.ultima_version_ios;

        const isOlder = isVersionOlder(currentVersion, minVersion);
        console.log('ESTO ES ISOLDER', isOlder)
        if (isOlder) {
          Alert.alert(
            'Actualización requerida',
            `⚠️ Tu versión es ${currentVersion} y la mínima permitida es ${minVersion}. Por favor actualiza la app.`,
            [
              {
                text: 'Actualizar ahora',
                onPress: async () => {
                    const storeUrl = Platform.OS === 'android'
                        ? await VersionCheck.getPlayStoreUrl({ packageName: 'com.mejorenbici2025' })
                        : await VersionCheck.getAppStoreUrl({ appID: '6739950184' });

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
