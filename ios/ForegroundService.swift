import Foundation
import CoreLocation
import UserNotifications

class ForegroundService: NSObject, CLLocationManagerDelegate {
    
    static let shared = ForegroundService()
    private let locationManager = CLLocationManager()
    private var isStarted = false
    private var lastLocation: CLLocation?
    private var totalDistance: CLLocationDistance = 0.0
    private let userDefaults = UserDefaults.standard

    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.requestAlwaysAuthorization()
        locationManager.allowsBackgroundLocationUpdates = true
        locationManager.pausesLocationUpdatesAutomatically = false
        locationManager.showsBackgroundLocationIndicator = true

        totalDistance = userDefaults.double(forKey: "distanciaNativa")
    }

    func startService() {
        if !isStarted {
            makeForeground()
            isStarted = true
            startLocationUpdates()
        }
    }

    func stopService() {
        isStarted = false
        locationManager.stopUpdatingLocation()
        print("Servicio detenido")
    }

    private func makeForeground() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            if granted {
                self.createNotification()
            }
        }
    }

    private func createNotification() {
        let content = UNMutableNotificationContent()
        content.title = "Rastreo Activo"
        content.body = "La aplicación está registrando tu ubicación"
        content.sound = .default

        let request = UNNotificationRequest(identifier: "ForegroundServiceNotification", content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
    }

    private func startLocationUpdates() {
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.distanceFilter = 2
        locationManager.startUpdatingLocation()
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        let lat = location.coordinate.latitude
        let lng = location.coordinate.longitude

        print("Nueva ubicación: Lat: \(lat), Lng: \(lng)")

        if let lastLocation = lastLocation {
            let distance = lastLocation.distance(from: location)
            totalDistance += distance
            saveDistanceInUserDefaults(totalDistance)
        }

        lastLocation = location
        saveLocationInUserDefaults(lat: lat, lng: lng)
    }

    private func saveLocationInUserDefaults(lat: Double, lng: Double) {
        var coordinatesArray = getSavedCoordinates()
        let newCoordinate: [String: Double] = ["lat": lat, "lng": lng]
        coordinatesArray.append(newCoordinate)

        userDefaults.set(try? JSONSerialization.data(withJSONObject: coordinatesArray, options: []), forKey: "rutaCoordinates")
        print("Coordenadas guardadas")
    }

    private func getSavedCoordinates() -> [[String: Double]] {
        if let data = userDefaults.data(forKey: "rutaCoordinates"),
           let coordinates = try? JSONSerialization.jsonObject(with: data, options: []) as? [[String: Double]] {
            return coordinates
        }
        return []
    }

    private func saveDistanceInUserDefaults(_ distance: CLLocationDistance) {
        print("Distancia calculada antes de guardar:", distance)
        userDefaults.set(distance, forKey: "distanciaNativa")
        print("Distancia acumulada: \(distance) metros")
    }

    @objc func clearStoredData() {
        userDefaults.removeObject(forKey: "rutaCoordinates")
        userDefaults.removeObject(forKey: "distanciaNativa")
        print("Datos de rastreo eliminados")
    }
}
