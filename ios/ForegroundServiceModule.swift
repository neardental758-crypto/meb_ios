import Foundation
import CoreLocation
import React

@objc(ForegroundServiceModule)
class ForegroundServiceModule: RCTEventEmitter, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()
    private var lastLocation: CLLocation?
    private let userDefaults = UserDefaults.standard

    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.distanceFilter = 2 // Ajusta según necesidad
        locationManager.allowsBackgroundLocationUpdates = true
        locationManager.pausesLocationUpdatesAutomatically = false
    }

    // ✅ Aquí agregas esta función:
    override func supportedEvents() -> [String] {
        return ["locationUpdated"]
    }

    @objc func startService() {
        locationManager.requestAlwaysAuthorization()
        locationManager.startUpdatingLocation()
    }

    @objc func stopService() {
        locationManager.stopUpdatingLocation()
    }

    @objc func getStoredCoordinates(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        if let location = lastLocation {
            let coordinates = [
                "latitude": location.coordinate.latitude,
                "longitude": location.coordinate.longitude
            ]
            resolve(coordinates)
        } else {
            reject("NO_LOCATION", "No location found", nil)
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        lastLocation = location

        let coordinates: [String: Any] = [
            "latitude": location.coordinate.latitude,
            "longitude": location.coordinate.longitude
        ]

        sendEvent(withName: "onLocationUpdate", body: coordinates)
    }

    override func supportedEvents() -> [String]! {
        return ["onLocationUpdate"]
    }

    @objc func getStoredDistance(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let distance = userDefaults.double(forKey: "distanciaNativa")
        resolve(distance)
    }
}
