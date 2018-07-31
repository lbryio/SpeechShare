package com.speechshare;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import javax.annotation.Nullable;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "SpeechShare";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Nullable
            @Override
            protected Bundle getLaunchOptions() {
                Intent receivedIntent = MainActivity.this.getIntent();
                Bundle bundle = new Bundle();

                if(receivedIntent != null) {
                    String intentType = receivedIntent.getType();
                    bundle.putString("intentType", intentType);

                    String intentText = receivedIntent.getStringExtra(Intent.EXTRA_TEXT);
                    bundle.putString("intentText", intentText);

                    Uri intentUri = (Uri) receivedIntent.getParcelableExtra(Intent.EXTRA_STREAM);
                    bundle.putString("intentUri", intentUri == null ? null : intentUri.toString());
                }

                return bundle;
            }
        };
    }
}
