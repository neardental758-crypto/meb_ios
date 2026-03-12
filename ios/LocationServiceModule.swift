import Foundation
import React
import CoreLocation
@objc(LocationServiceModule)
public class LocationServiceModule:RCTEventEmitter, CLLocationManagerDelegate {
  var locationManager: CLLocationManager!
      var lastLocation: CLLocation?
      var totalDistance: Double = 0.0
      
      override init() {
          super.init()
          locationManager = CLLocationManager()
          locationManager.delegate = self
          locationManager.requestWhenInUseAuthorization()
          locationManager.startUpdatingLocation()
      }
  override public func supportedEvents() -> [String]! {
        return ["onLocationUpdate"]
    }
  private var locationService = LocationService()
  @objc
  public func startService(_ resolver: @escaping RCTPromiseResolveBlock, rejecter rejecter: @escaping RCTPromiseRejectBlock) {
    print("iniciando funcion startService")
    ForegroundService.shared.startService()
    resolver("Servicio iniciado")
  }
  
  @objc
  public func stopService(_ resolver: @escaping RCTPromiseResolveBlock, rejecter rejecter: @escaping RCTPromiseRejectBlock) {
    ForegroundService.shared.stopService()
    resolver("Servicio detenido")
  }
  @objc
  public func addCoordinateFromReact(_ latitude: Double, longitude: Double, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let coordinate = CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    
    // Obtener la última coordenada guardada
    let lastCoordinatesData = UserDefaults.standard.data(forKey: "rutaCoordinates")
    var lastCoordinate: CLLocationCoordinate2D?
    var coordinatesArray: [[String: Double]] = [] // Inicialización
    
    if let data = lastCoordinatesData,
       let savedCoordinatesArray = try? JSONSerialization.jsonObject(with: data, options: []) as? [[String: Double]],
       let lastCoordinateDict = savedCoordinatesArray.last {
      lastCoordinate = CLLocationCoordinate2D(latitude: lastCoordinateDict["latitude"]!, longitude: lastCoordinateDict["longitude"]!)
      coordinatesArray = savedCoordinatesArray // Asignar los valores guardados
    }
    
    // Agregar la nueva coordenada
    locationService.addCoordinate(coordinate)
    
    // Calcular la distancia si hay una última coordenada
    if let lastCoordinate = lastCoordinate {
      let previousLocation = CLLocation(latitude: lastCoordinate.latitude, longitude: lastCoordinate.longitude)
      let currentLocation = CLLocation(latitude: latitude, longitude: longitude)
      
      // Calcular la distancia entre la última y la nueva coordenada
      let distanceSegment = previousLocation.distance(from: currentLocation) // Devuelve la distancia en metros
      
      // Obtener la distancia acumulada actual de UserDefaults
      let accumulatedDistance = UserDefaults.standard.float(forKey: "distanciaNativa")
      
      // Sumar la nueva distancia y guardar el valor actualizado en UserDefaults
      let newDistance = accumulatedDistance + Float(distanceSegment)
      UserDefaults.standard.set(newDistance, forKey: "distanciaNativa")
      
      print("Distancia acumulada: \(newDistance) metros") // Para depuración
    } else {
      print("No hay coordenadas previas para calcular la distancia.")
    }
    
    // Agregar la nueva coordenada al array y guardar en UserDefaults
    coordinatesArray.append(["latitude": latitude, "longitude": longitude])
    if let data = try? JSONSerialization.data(withJSONObject: coordinatesArray, options: []) {
      UserDefaults.standard.set(data, forKey: "rutaCoordinates")
    }
    
    resolve("Coordenada agregada: \(latitude), \(longitude)")
  }
  public func  locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
         guard let location = locations.last else { return }
         let lat = location.coordinate.latitude
         let lng = location.coordinate.longitude

         // Enviar el evento a React Native
         sendEvent(withName: "onLocationUpdate", body: ["latitude": lat, "longitude": lng])

         // Calcular y guardar distancia
         if let lastLocation = lastLocation {
             let distance = lastLocation.distance(from: location)
             totalDistance += distance
             saveDistanceInUserDefaults(totalDistance)
         }

         lastLocation = location
         saveLocationInUserDefaults(lat: lat, lng: lng)
     }
 

  @objc(saveLocationInUserDefaults:lng:)
  public func saveLocationInUserDefaults(lat: Double, lng: Double) {
      let newLocation = CLLocation(latitude: lat, longitude: lng)
       locationManager.allowsBackgroundLocationUpdates = true
      // Recuperar las coordenadas actuales guardadas en UserDefaults
      var coordinatesArray: [[String: Double]] = []
      if let data = UserDefaults.standard.data(forKey: "rutaCoordinates") {
          do {
              if let savedCoordinates = try JSONSerialization.jsonObject(with: data, options: []) as? [[String: Double]] {
                  coordinatesArray = savedCoordinates
              }
          } catch {
              print("Error al procesar las coordenadas guardadas en UserDefaults: \(error)")
              // Limpia UserDefaults en caso de error
              UserDefaults.standard.removeObject(forKey: "rutaCoordinates")
          }
      }
      
      // Cargar la distancia acumulada actual
      var totalDistance = UserDefaults.standard.double(forKey: "distanciaNativa")
      
      if let lastCoordinate = coordinatesArray.last,
         let lastLat = lastCoordinate["latitude"],
         let lastLng = lastCoordinate["longitude"] {
          
          let lastLocation = CLLocation(latitude: lastLat, longitude: lastLng)
          let distance = lastLocation.distance(from: newLocation) // Calcula la distancia en metros
          
          totalDistance += distance // Acumula la distancia
      }
      
      // Agregar la nueva coordenada al array
      coordinatesArray.append(["latitude": lat, "longitude": lng])
      
      // Guardar el array actualizado en UserDefaults
      do {
          let updatedData = try JSONSerialization.data(withJSONObject: coordinatesArray, options: [])
          UserDefaults.standard.set(updatedData, forKey: "rutaCoordinates")
      } catch {
          print("Error al guardar las coordenadas en UserDefaults: \(error)")
      }
      
      // Guardar la distancia acumulada en UserDefaults
      UserDefaults.standard.set(totalDistance, forKey: "distanciaNativa")
      
      print("Distancia acumulada guardada: \(totalDistance) metros")
  }

    
    func saveDistanceInUserDefaults(_ distance: Double) {
        UserDefaults.standard.set(distance, forKey: "totalDistance")
    }
  @objc func requestCurrentLocation() {
      locationManager.requestLocation()  // Solicita una actualización de la ubicación
  }

  @objc func getLastKnownLocation(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
      if let location = lastLocation {
        print("en la funcion de the last know location")
          let lat = location.coordinate.latitude
          let lng = location.coordinate.longitude
          resolve(["latitude": lat, "longitude": lng])
      } else {
          reject("no_location", "No se encontró ninguna ubicación", nil)
      }
  }
}
