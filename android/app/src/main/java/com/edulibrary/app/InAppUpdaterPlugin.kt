package com.edulibrary.app

import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.FileProvider
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.PluginMethod
import java.io.File
import java.net.HttpURLConnection
import java.net.URL

@CapacitorPlugin(name = "InAppUpdater")
class InAppUpdaterPlugin : Plugin() {

    @PluginMethod
    fun installApk(call: PluginCall) {
        val apkUrl = call.getString("url")
        if (apkUrl.isNullOrBlank()) {
            call.reject("APK URL is missing")
            return
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
            !context.packageManager.canRequestPackageInstalls()
        ) {
            val intent = Intent(
                Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                Uri.parse("package:${context.packageName}")
            )
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)

            val ret = JSObject()
            ret.put("status", "permission_required")
            call.resolve(ret)
            return
        }

        val updatesDir = File(context.cacheDir, "updates")
        if (!updatesDir.exists()) updatesDir.mkdirs()
        val apkFile = File(updatesDir, "EduLibrary-update.apk")

        call.setKeepAlive(true)

        Thread {
            var connection: HttpURLConnection? = null
            try {
                connection = (URL(apkUrl).openConnection() as HttpURLConnection).apply {
                    requestMethod = "GET"
                    connectTimeout = 20000
                    readTimeout = 60000
                    instanceFollowRedirects = true
                    setRequestProperty("User-Agent", "Edu-Library-InAppUpdater")
                }

                if (connection.responseCode !in 200..299) {
                    throw Exception("Download failed: HTTP ${connection.responseCode}")
                }

                connection.inputStream.use { input ->
                    apkFile.outputStream().use { output ->
                        input.copyTo(output, 64 * 1024)
                    }
                }

                val uri = FileProvider.getUriForFile(
                    context,
                    "${context.packageName}.fileprovider",
                    apkFile
                )

                val installIntent = Intent(Intent.ACTION_VIEW).apply {
                    setDataAndType(uri, "application/vnd.android.package-archive")
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
                }

                activity.runOnUiThread {
                    context.startActivity(installIntent)
                    val ret = JSObject()
                    ret.put("status", "installer_opened")
                    call.resolve(ret)
                }
            } catch (e: Exception) {
                apkFile.delete()
                activity.runOnUiThread {
                    call.reject(e.message ?: "APK download/install failed")
                }
            } finally {
                connection?.disconnect()
            }
        }.start()
    }
}
