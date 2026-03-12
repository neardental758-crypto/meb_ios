package com.mejorenbici

import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class SharedPreferencesModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    // Reutiliza la misma instancia de SharedPreferences para obtener y eliminar los datos
    private val sharedPreferences: SharedPreferences = reactContext.getSharedPreferences("LocationData", Context.MODE_PRIVATE)

    override fun getName(): String {
        return "SharedPreferencesModule"
    }

    @ReactMethod
    fun getCoordinates(promise: Promise) {
        try {
            // Obtén las coordenadas almacenadas en SharedPreferences bajo la clave "rutaCoordinates"
            val coordinates = sharedPreferences.getString("rutaCoordinates", "[]")
            promise.resolve(coordinates)
        } catch (e: Exception) {
            promise.reject("Error", e.message)
        }
    }

    @ReactMethod
    fun getDistance(promise: Promise) {
        try {
            // Obtén la distancia almacenada como Float en SharedPreferences bajo la clave "distanciaNativa"
            val distancia = sharedPreferences.getFloat("distanciaNativa", 0.0f)
            promise.resolve(distancia.toDouble()) // Pasarlo a Double para compatibilidad con JavaScript
        } catch (e: Exception) {
            promise.reject("Error", e.message)
        }
    }

    @ReactMethod
    fun clearCoordinates(promise: Promise) {
        try {
            // Usa la misma instancia de sharedPreferences y elimina la clave "rutaCoordinates"
            val editor = sharedPreferences.edit()
            editor.remove("rutaCoordinates") // Borra la clave "rutaCoordinates"
            editor.remove("distanciaNativa") // Borra la clave "distanciaNativa"
            editor.apply()
            promise.resolve("SharedPreferences cleared successfully")
        } catch (e: Exception) {
            promise.reject("Error", e)
        }
    }
}
