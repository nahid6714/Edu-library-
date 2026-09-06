# Edu Library release/update setup

This project is configured so every push to `main`/`master` can build a signed APK, publish a GitHub Release, and update `version.json` used by the in-app update checker.

## 1. Create one release keystore

Create the keystore once and keep it backed up. **Never commit it to GitHub.**

```bash
keytool -genkeypair -v \
  -keystore edulibrary-release.keystore \
  -alias edulibrary \
  -keyalg RSA \
  -keysize 4096 \
  -validity 10000
```

Record the keystore password, alias, and key password.

## 2. Add these GitHub Actions secrets

Repository → Settings → Secrets and variables → Actions → New repository secret:

- `ANDROID_KEYSTORE_BASE64` — base64 text of `edulibrary-release.keystore`
- `ANDROID_KEYSTORE_PASSWORD` — keystore password
- `ANDROID_KEY_ALIAS` — normally `edulibrary`
- `ANDROID_KEY_PASSWORD` — key password

For PowerShell, the base64 value can be copied with:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("edulibrary-release.keystore")) | Set-Clipboard
```

## 3. How future updates work

1. Change the app source code.
2. Commit and push to `main`.
3. GitHub Actions creates a new version (`1.0.<run number>`), increases Android `versionCode`, builds a **signed release APK**, and publishes a GitHub Release.
4. The workflow updates `version.json` in the repository.
5. Installed Edu Library apps check `version.json` and show the update banner/modal when a newer version exists.
6. The user downloads the APK and Android installs it as an update because the package ID and signing key are unchanged.

## Important

The signing keystore is part of the app's identity. Losing it means future APKs cannot be installed as updates over APKs signed with that key.

The first APK distributed to users must also be signed with this same release keystore. The old workflow used `assembleDebug`, so an APK produced by that old workflow may **not** be upgradeable to the new signed-release APK. If that old APK is already installed, uninstall/reinstall the first signed release once (which can clear app data).
