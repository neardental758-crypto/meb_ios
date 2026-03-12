package com.mejorenbici

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import org.json.JSONArray
import org.json.JSONObject

class ForegroundService : Service(), LocationListener {

    private lateinit var notificationManager: NotificationManager
    private lateinit var locationManager: LocationManager
    private lateinit var sharedPreferences: SharedPreferences
    private var isStarted = false
    private var lastLocation: Location? = null // Para almacenar la última ubicación conocida
    private var totalDistance: Float = 0f // Para almacenar la distancia acumulada

    override fun onCreate() {
        super.onCreate()
        notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
        sharedPreferences = getSharedPreferences("LocationData", Context.MODE_PRIVATE)

        try {
            locationManager.requestLocationUpdates(
                LocationManager.GPS_PROVIDER,
                5000L,
                2f,
                this
            )
        } catch (ex: SecurityException) {
            Log.e("ForegroundService", "Permisos de ubicación no concedidos: ${ex.message}")
        }

        // Recuperar la distancia acumulada si ya estaba guardada
        totalDistance = sharedPreferences.getFloat("distanciaNativa", 0f)
    }

    override fun onDestroy() {
        super.onDestroy()
        isStarted = false
        locationManager.removeUpdates(this)
    }

    override fun onBind(intent: Intent?): IBinder? {
        throw UnsupportedOperationException()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (!isStarted) {
            makeForeground()
            isStarted = true
        }
        return START_STICKY
    }

    private fun makeForeground() {
        createServiceNotificationChannel()

        val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Rastreo SP")
            .setContentText("Se ha iniciado el rastreo sp")
            .setSmallIcon(R.drawable.ic_launcher)
            .build()

        startForeground(ONGOING_NOTIFICATION_ID, notification)
    }

    private fun createServiceNotificationChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return
        }

        val channel = NotificationChannel(
            CHANNEL_ID,
            "Foreground Service Channel",
            NotificationManager.IMPORTANCE_DEFAULT
        )

        notificationManager.createNotificationChannel(channel)
    }

    companion object {
        private const val ONGOING_NOTIFICATION_ID = 101
        private const val CHANNEL_ID = "1001"

        fun startService(context: Context) {
            val intent = Intent(context, ForegroundService::class.java)
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                context.startService(intent)
            } else {
                context.startForegroundService(intent)
            }
        }

        fun stopService(context: Context) {
            val intent = Intent(context, ForegroundService::class.java)
            context.stopService(intent)
        }
    }

    // Cuando cambie la ubicación, este método será llamado
    override fun onLocationChanged(location: Location) {
        val lat = location.latitude
        val lng = location.longitude
        Log.d("ForegroundService", "Nueva ubicación: Latitud: $lat, Longitud: $lng")

        // Si tenemos una ubicación previa, calcular la distancia
        if (lastLocation != null) {
            val distance = lastLocation!!.distanceTo(location) // Calcula la distancia en metros
            totalDistance += distance // Acumular la distancia
            saveDistanceInSharedPreferences(totalDistance) // Guardar la distancia acumulada en SharedPreferences
        }

        // Actualizar la última ubicación conocida
        lastLocation = location

        // Guardar la nueva ubicación en SharedPreferences
        saveLocationInSharedPreferences(lat, lng)
    }

    private fun saveLocationInSharedPreferences(lat: Double, lng: Double) {
        val coordinatesArray = JSONArray()

        // Recuperar las coordenadas previamente guardadas
        val savedData = sharedPreferences.getString("rutaCoordinates", "[]")
        val previousCoordinates = JSONArray(savedData)

        for (i in 0 until previousCoordinates.length()) {
            coordinatesArray.put(previousCoordinates.get(i))
        }

        // Añadir la nueva coordenada al array
        val newCoordinate = JSONObject().apply {
            put("lat", lat)
            put("lng", lng)
        }
        coordinatesArray.put(newCoordinate)

        // Guardar las coordenadas actualizadas en SharedPreferences
        sharedPreferences.edit().putString("rutaCoordinates", coordinatesArray.toString()).apply()
        Log.d("ForegroundService", "Coordenadas guardadas en SharedPreferences")
    }

    private fun saveDistanceInSharedPreferences(distance: Float) {
        // Guardar la distancia acumulada en SharedPreferences
        sharedPreferences.edit().putFloat("distanciaNativa", distance).apply()
        Log.d("ForegroundService", "Distancia acumulada guardada: $distance metros")
    }

    override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
    override fun onProviderEnabled(provider: String) {}
    override fun onProviderDisabled(provider: String) {}
}
