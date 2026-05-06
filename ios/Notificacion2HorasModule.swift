import Foundation
import UserNotifications
import React

@objc(Notificacion2HorasModule)
class Notificacion2HorasModule: NSObject, RCTBridgeModule {

  static func moduleName() -> String! {
    return "Notificacion2HorasModule"
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc func programarNotificacion2Horas(_ fechaMillis: NSNumber) {
    let fechaObjetivo = Date(timeIntervalSince1970: fechaMillis.doubleValue / 1000)

    // Fecha de notificación (2 horas antes)
    let notificacionDate = fechaObjetivo.addingTimeInterval(-2 * 60 * 60)

    let center = UNUserNotificationCenter.current()
    center.requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
      if granted && error == nil {
        // 1️⃣ Enviar notificación inmediata de confirmación
        self.enviarNotificacionInmediata()

        // 2️⃣ Programar notificación 2 horas antes
        self.programarNotificacion(fechaObjetivo: fechaObjetivo, notificacionDate: notificacionDate)
      } else {
        print("⚠️ No se concedieron permisos para notificaciones")
      }
    }
  }

  private func enviarNotificacionInmediata() {
    let content = UNMutableNotificationContent()
    content.title = "Notificación programada ✅"
    content.body = "Se ha configurado un recordatorio. Te avisaremos 2 horas antes de que venza tu préstamo."
    content.sound = .default

    // Trigger inmediato (1 segundo después)
    let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)

    let request = UNNotificationRequest(
      identifier: "NotificacionConfirmacion",
      content: content,
      trigger: trigger
    )

    UNUserNotificationCenter.current().add(request) { error in
      if let error = error {
        print("❌ Error al enviar notificación inmediata: \(error)")
      } else {
        print("✅ Notificación inmediata enviada")
      }
    }
  }

  private func programarNotificacion(fechaObjetivo: Date, notificacionDate: Date) {
    let content = UNMutableNotificationContent()
    let formatter = DateFormatter()
    formatter.dateFormat = "HH:mm"
    let horaTexto = formatter.string(from: fechaObjetivo)

    content.title = "Recordatorio ⏰"
    content.body = "Tu préstamo vence a las \(horaTexto). Te recordamos con 2 horas de anticipación."
    content.sound = .default

    let segundos = notificacionDate.timeIntervalSinceNow

    if segundos > 0 {
      let trigger = UNTimeIntervalNotificationTrigger(timeInterval: segundos, repeats: false)

      let request = UNNotificationRequest(
        identifier: "Notificacion2Horas",
        content: content,
        trigger: trigger
      )

      UNUserNotificationCenter.current().add(request) { error in
        if let error = error {
          print("❌ Error al programar notificación: \(error)")
        } else {
          print("✅ Notificación programada para \(notificacionDate)")
        }
      }
    } else {
      print("⚠️ La hora de notificación ya pasó, no se puede programar.")
    }
  }

  @objc func cancelarNotificacion2Horas() {
    UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["Notificacion2Horas", "NotificacionConfirmacion"])
    UNUserNotificationCenter.current().removeDeliveredNotifications(withIdentifiers: ["Notificacion2Horas", "NotificacionConfirmacion"])
    print("🗑️ Notificaciones canceladas")
  }
}
