package com.ctere1.reactnativechat;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import com.myclay.claysdk.api.ClaySDK;
import com.myclay.claysdk.api.IClaySDK;
import com.myclay.claysdk.api.IDigitalKeyCallback;
import com.myclay.claysdk.api.ClayResult;
import com.myclay.claysdk.api.error.ClayException;

public class RNSaltoModule extends ReactContextBaseJavaModule {

    private static final String MODULE_NAME = "RNSaltoModule";
    private final ReactApplicationContext reactContext;
    private IClaySDK clayInstance;

    public RNSaltoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void getPublicKey(String installationId, String publicApiKey, Promise promise) {
        try {
            clayInstance = ClaySDK.init(reactContext, publicApiKey, installationId);
            String publicKey = clayInstance.getPublicKey();
            promise.resolve(publicKey);
        } catch (ClayException e) {
            promise.reject("GET_PUBLIC_KEY_ERROR", e.getMessage(), e);
        }
    }

    @ReactMethod
public void openDoor(String mobileKeyData, Promise promise) {
    if (clayInstance == null) {
        promise.reject("CLAY_SDK_NOT_INITIALIZED", "Clay SDK not initialized. Call getPublicKey first.");
        return;
    }
    Log.e("RNSaltoModule", clayInstance.toString());

    try {
        clayInstance.sendDigitalKey(mobileKeyData, new IDigitalKeyCallback() {
            @Override
            public void onLockFound() {
                Log.d(MODULE_NAME, "Lock Found");
            }

            @Override
            public void onSuccess(ClayResult result, String message) {
                Log.d("result", result.toString());
                if (result == ClayResult.SUCCESS) {
                    promise.resolve("Door opened successfully");
                } else {
                    promise.reject("KEY_REJECTED", "Key was not accepted. Result: " + result.name());
                }
            }

            @Override
            public void onFailure(ClayException e) {
                Log.e("RNSaltoModule", "Failed to open door", e);
                promise.reject("OPEN_DOOR_ERROR", e.getMessage(), e);
            }
        });
    } catch (ClayException e) {
        promise.reject("SEND_DIGITAL_KEY_FAILED", e.getMessage(), e);
    }
}
}