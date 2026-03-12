import MapKit

class LocationService: NSObject, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()
    private var polyline: MKPolyline?
    private var coordinates: [CLLocationCoordinate2D] = []

    func startTracking() {
        locationManager.delegate = self
        locationManager.startUpdatingLocation()
        locationManager.allowsBackgroundLocationUpdates = true
      print("Started tracking location") // Depuración
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
      print("Updated location: \(location.coordinate.latitude), \(location.coordinate.longitude)") // Depuración
        // Agregar la nueva ubicación a la lista de coordenadas
        let coordinate = CLLocationCoordinate2D(latitude: location.coordinate.latitude, longitude: location.coordinate.longitude)
        addCoordinate(coordinate)
    }

  public func addCoordinate(_ coordinate: CLLocationCoordinate2D) {
      // Agregar la coordenada a la lista
      coordinates.append(coordinate)
      print("Added coordinate: \(coordinate.latitude), \(coordinate.longitude)") // Depuración
      
      // Crear la polyline con las coordenadas
      polyline = MKPolyline(coordinates: coordinates, count: coordinates.count)
      
      // Calcular y guardar la distancia
      if coordinates.count > 1 {
          // Obtener la última coordenada
          let previousCoordinate = coordinates[coordinates.count - 2]
          let previousLocation = CLLocation(latitude: previousCoordinate.latitude, longitude: previousCoordinate.longitude)
          let currentLocation = CLLocation(latitude: coordinate.latitude, longitude: coordinate.longitude)
          
          // Calcular la distancia entre la última y la nueva coordenada
          let distanceSegment = previousLocation.distance(from: currentLocation) // Devuelve la distancia en metros
          
          // Obtener la distancia acumulada actual de UserDefaults
          let accumulatedDistance = UserDefaults.standard.float(forKey: "distanciaNativa")
          
          // Sumar la nueva distancia y guardar el valor actualizado en UserDefaults
          let newDistance = accumulatedDistance + Float(distanceSegment)
          UserDefaults.standard.set(newDistance, forKey: "distanciaNativa")
      }
      
      // Guardar coordenadas en UserDefaults
      let coordinatesArray = coordinates.map { ["latitude": $0.latitude, "longitude": $0.longitude] }
      if let data = try? JSONSerialization.data(withJSONObject: coordinatesArray, options: []) {
          UserDefaults.standard.set(data, forKey: "rutaCoordinates")
      }
  }

  

    // Método del delegate de MKMapView para renderizar la polyline
    func mapView(_ mapView: MKMapView, rendererFor overlay: MKOverlay) -> MKOverlayRenderer {
        if let polyline = overlay as? MKPolyline {
            let renderer = MKPolylineRenderer(polyline: polyline)
            renderer.strokeColor = UIColor.red // Establecer el color rojo
            renderer.lineWidth = 4.0 // Establecer el ancho de la línea
            return renderer
        }
        return MKOverlayRenderer(overlay: overlay)
    }

    func stopTracking() {
        locationManager.stopUpdatingLocation()
        polyline = nil // Limpiar la polyline al detener el seguimiento
        coordinates.removeAll() // Limpiar las coordenadas
    }
}
