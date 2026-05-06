#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Notificacion2HorasModule, NSObject)

RCT_EXTERN_METHOD(programarNotificacion2Horas:(nonnull NSNumber *)fechaMillis)
RCT_EXTERN_METHOD(cancelarNotificacion2Horas)

@end
