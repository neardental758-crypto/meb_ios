#!/bin/bash

echo "🧹 Limpiando proyecto React Native..."

# Detener metro y cualquier proceso en el puerto 8081
kill $(lsof -t -i:8081) 2> /dev/null

# Limpiar caché de Metro y Watchman
watchman watch-del-all
rm -rf node_modules
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*
rm -rf ios/Pods
rm -rf ios/Podfile.lock
rm -rf ios/build
rm -rf ~/Library/Developer/Xcode/DerivedData
rm -rf android/.gradle
rm -rf android/app/build

# Instalar dependencias
npm install --force

# Reinstalar Pods
cd ios && pod install --repo-update && cd ..

# Listo
echo "✅ Limpieza completa. Puedes correr: npx react-native run-ios"
