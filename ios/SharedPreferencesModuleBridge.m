#import <React/RCTBridgeModule.h>
// Cambia esto si tu proyecto tiene otro nombre

@interface RCT_EXTERN_MODULE(SharedPreferencesModule, NSObject)

RCT_EXTERN_METHOD(getCoordinates:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getDistance:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clearCoordinates:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
