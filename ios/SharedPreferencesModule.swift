import Foundation
import React

@objc(SharedPreferencesModule)
class SharedPreferencesModule: NSObject, RCTBridgeModule {
    
    // Esto es necesario para que el módulo sea visible desde JavaScript
    static func moduleName() -> String {
        return "SharedPreferencesModule"
    }

    private let userDefaults = UserDefaults.standard

    // Indica si el módulo necesita ser configurado en el hilo principal
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }

  @objc
  func getCoordinates(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
      guard let data = UserDefaults.standard.data(forKey: "rutaCoordinates"),
            let coordinatesArray = try? JSONSerialization.jsonObject(with: data, options: []) as? [[String: Double]]
      else {
          reject("E_NO_DATA", "No se encontraron coordenadas en UserDefaults", nil)
          return
      }
      
      resolve(coordinatesArray)
  }




  @objc
  func getDistance(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
      let distance = UserDefaults.standard.float(forKey: "distanciaNativa")
      if distance == 0 {
        resolve(Double(distance))
      } else {
          resolve(Double(distance))
      }
  }




  @objc
  func clearCoordinates(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
      userDefaults.removeObject(forKey: "rutaCoordinates")
      userDefaults.removeObject(forKey: "distanciaNativa")
      resolve("UserDefaults cleared successfully")
  }

}
