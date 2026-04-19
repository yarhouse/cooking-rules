---
name: rebuild-icons
description: Regenerate all icon files (Electron icns/ico, web favicon.ico/png) from build/icon.png
disable-model-invocation: true
allowed-tools: Bash(sips *), Bash(iconutil *), Bash(npx *), Bash(rm *), Bash(mkdir *), Bash(ls *)
---

Regenerate every derived icon file from `build/icon.png`. Run these steps in order:

## 1 — Verify source

Check that `build/icon.png` exists and is at least 512×512.

```bash
file build/icon.png
sips -g pixelWidth -g pixelHeight build/icon.png
```

If the file is missing or smaller than 512px, stop and tell the user.

## 2 — macOS .icns (Electron)

Build an iconset directory with all required sizes, then run `iconutil`.

```bash
mkdir -p build/icon.iconset

for size in 16 32 64 128 256 512; do
  sips -z $size $size build/icon.png --out "build/icon.iconset/icon_${size}x${size}.png" --setProperty format png
done

sips -z 32   32   build/icon.png --out build/icon.iconset/icon_16x16@2x.png   --setProperty format png
sips -z 64   64   build/icon.png --out build/icon.iconset/icon_32x32@2x.png   --setProperty format png
sips -z 256  256  build/icon.png --out build/icon.iconset/icon_128x128@2x.png --setProperty format png
sips -z 1024 1024 build/icon.png --out build/icon.iconset/icon_512x512@2x.png --setProperty format png

iconutil -c icns build/icon.iconset -o build/icon.icns
rm -rf build/icon.iconset
```

## 3 — Windows .ico (Electron)

Generate a multi-size ICO with 256px input (png-to-ico embeds 16/32/48/256 internally).

```bash
sips -z 256 256 build/icon.png --out /tmp/icon-256.png --setProperty format png
npx --yes png-to-ico /tmp/icon-256.png > build/icon.ico
```

## 4 — Web favicon.ico

```bash
sips -z 32 32 build/icon.png --out /tmp/fav-32.png --setProperty format png
npx png-to-ico /tmp/fav-32.png > public/favicon.ico
```

## 5 — Web favicon.png

```bash
sips -z 32 32 build/icon.png --out public/favicon.png --setProperty format png
```

## 6 — PWA icons

Generate the two sizes required by the web app manifest.

```bash
mkdir -p public/icons
sips -z 192 192 build/icon.png --out public/icons/icon-192x192.png --setProperty format png
sips -z 512 512 build/icon.png --out public/icons/icon-512x512.png --setProperty format png
```

## 7 — Confirm output

List all generated files with sizes so the user can see everything succeeded.

```bash
ls -lh build/icon.icns build/icon.ico public/favicon.ico public/favicon.png public/icons/icon-192x192.png public/icons/icon-512x512.png
```

Report success and remind the user that `build/icon.png` is the only file they ever need to replace.
