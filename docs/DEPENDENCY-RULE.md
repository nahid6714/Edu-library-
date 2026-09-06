# Dependency / Lockfile Rule

Whenever `package.json` changes, run `npm install` from the project root and commit **both** files:

- `package.json`
- `package-lock.json`

Do not manually edit `package-lock.json`. If a ZIP from another editor/AI replaces the project, run `npm install` again before pushing.

The GitHub Actions workflow runs `npm install --ignore-scripts` and automatically repairs `package-lock.json` when it is out of sync, then commits the repaired lockfile with `[skip ci]`.

## Safe update workflow

1. Replace/customize the project.
2. From the project root run `npm install`.
3. Check and commit `package.json` and `package-lock.json` together.
4. Push to `main`.
5. GitHub Actions validates the lockfile, builds the signed APK, and publishes the release.

If nothing in `package.json` changed, `npm install` is still safe to run; it should leave the lockfile unchanged when everything is already synchronized.
