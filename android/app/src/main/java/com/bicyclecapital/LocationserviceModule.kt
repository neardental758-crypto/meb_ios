package com.mejorenbici

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class LocationServiceModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "LocationServiceModule"
    }

    // Método para iniciar el servicio desde React Native
    @ReactMethod
    fun startService() {
        val context = reactApplicationContext
        val intent = Intent(context, ForegroundService::class.java)
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }
    }

    // Método para detener el servicio desde React Native
    @ReactMethod
    fun stopService() {
        val context = reactApplicationContext
        val intent = Intent(context, ForegroundService::class.java)
        context.stopService(intent)
    }
}
