#!/bin/bash

echo "🧹 Limpiando proyecto React Native..."

# Detener Metro Bundler (puerto 8081)
echo "🛑 Deteniendo procesos en el puerto 8081..."
lsof -ti tcp:8081 | xargs kill -9 2> /dev/null || echo "⚠️  No se encontró proceso en el puerto 8081"

# Borrar cachés de Metro, Watchman, Haste
echo "🧼 Borrando cachés..."
watchman watch-del-all || echo "⚠️  Watchman no instalado o sin registros"
rm -rf node_modules
rm package-lock.json 
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*
rm -rf ios/Pods
rm -rf ios/Podfile.lock
rm -rf ios/build
rm -rf android/.gradle
rm -rf android/app/build
rm -rf .gradle
rm -rf build
rm -rf ~/.gradle/caches/
rm -rf ~/.gradle/daemon/

# Borrar artefactos de Xcode
echo "🧽 Borrando cachés de Xcode..."
rm -rf ~/Library/Developer/Xcode/DerivedData/*
rm -rf ~/Library/Caches/com.apple.dt.Xcode
rm -rf ~/Library/Developer/Xcode/Archives/*
rm -rf ~/Library/Developer/Xcode/Products/*

# Reinstalar dependencias
echo "📦 Instalando dependencias npm..."
npm install --force || { echo "❌ Falló npm install"; exit 1; }

# Instalar pods
echo "📦 Reinstalando Pods..."
cd ios && pod deintegrate && pod install --repo-update || { echo "❌ Falló pod install"; exit 1; }
cd ..

echo "✅ Limpieza y reinstalación completa."
echo "🚀 Puedes correr: npx react-native run-ios"
