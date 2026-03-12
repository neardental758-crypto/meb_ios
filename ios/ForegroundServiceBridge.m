#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ForegroundServiceModule, RCTEventEmitter)

RCT_EXTERN_METHOD(startService)
RCT_EXTERN_METHOD(stopService)
RCT_EXTERN_METHOD(getStoredCoordinates:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(clearStoredData)
RCT_EXTERN_METHOD(getStoredDistance:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)


@end

