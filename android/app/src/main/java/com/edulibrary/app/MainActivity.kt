package com.edulibrary.app

import android.os.Bundle
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(InAppUpdaterPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}
