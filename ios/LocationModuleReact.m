#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
// Cambia esto al nombre correcto si es necesario

@interface RCT_EXTERN_MODULE(LocationServiceModule, NSObject)

RCT_EXTERN_METHOD(startService:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)
RCT_EXTERN_METHOD(stopService:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)
RCT_EXTERN_METHOD(addCoordinateFromReact:(double)latitude longitude:(double)longitude resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(requestCurrentLocation)
RCT_EXTERN_METHOD(getLastKnownLocation:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(saveLocationInUserDefaults:(double)lat lng:(double)lng)
@end
