# Edu Library — In-App Android Update

This build downloads the APK from inside the native Android app and opens the Android package installer directly.
It no longer opens GitHub/browser for the APK download.

Important Android limitation:
- A normal Android app cannot silently replace its own APK.
- The final Android **Install** confirmation is still shown by the operating system.
- On Android 8+, the user may need to allow **Install unknown apps** for Edu Library once. After that, future updates can proceed directly from the app.

Important hosting limitation:
- The APK URL must be publicly downloadable without GitHub login.
- If the GitHub repository is private, the app cannot anonymously download the release APK.
- Do NOT put a GitHub personal access token inside the APK.
- Either make the release/download endpoint public or host the update APK and version.json on a public update server/CDN.
