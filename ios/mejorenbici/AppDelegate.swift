import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Lottie
import UserNotifications
import FirebaseCore // 👈

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    
    // 🔥 INICIALIZAR FIREBASE PRIMERO
    if FirebaseApp.app() == nil {
      FirebaseApp.configure()
      print("✅ Firebase configurado exitosamente")
    }
    
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "mejorenbici",
      in: window,
      launchOptions: launchOptions
    )

    // ✅ Configurar notificaciones locales
    let center = UNUserNotificationCenter.current()
    center.delegate = self
    
    // Solicitar permisos de notificaciones
    center.requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
      if let error = error {
        print("❌ Error solicitando permisos: \(error)")
      } else if granted {
        print("✅ Permisos de notificación concedidos")
        DispatchQueue.main.async {
          application.registerForRemoteNotifications()
        }
      }
    }

    return true
  }

  // 👇 Esto permite mostrar notificaciones incluso con la app abierta
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                               willPresent notification: UNNotification,
                               withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    let userInfo = notification.request.content.userInfo
    print("🔔 [AppDelegate] Notificación RECIBIDA en nativo (willPresent): \(userInfo)")
    completionHandler([.banner, .sound, .badge])
  }
  
  // 🔥 Recibir token de APNS
  func application(_ application: UIApplication, 
                   didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
    let token = tokenParts.joined()
    print("✅ [AppDelegate] Token APNS recibido: \(token)")
  }
  
  // 🔥 Error al registrar notificaciones
  func application(_ application: UIApplication, 
                   didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("❌ Error al registrar notificaciones: \(error)")
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    if let bundleURL = Bundle.main.url(forResource: "main", withExtension: "jsbundle") {
      return bundleURL
    }
    // Fallback to Metro if offline bundle is missing (useful for testing release builds locally or if build triggers release config unexpectedly)
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#endif
  }
}