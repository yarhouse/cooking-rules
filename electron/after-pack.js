/**
 * electron-builder afterPack hook.
 *
 * Problem: better-sqlite3 is a native Node addon in server/node_modules, not
 * the root node_modules. electron-builder's built-in native module rebuild only
 * scans the root — it never rebuilds server/node_modules. When dist:mac builds
 * for both x64 and arm64, whatever better_sqlite3.node was compiled on the host
 * machine ends up in both DMGs, causing an arch mismatch crash on the other arch.
 *
 * Fix: after electron-builder assembles each platform bundle, rebuild
 * better-sqlite3 for that bundle's exact target arch, copy the binary into the
 * assembled app, then restore the host-Node binary so local dev still works.
 */

const { rebuild } = require('@electron/rebuild');
const path = require('path');
const fs = require('fs');

// electron-builder Arch enum → Node arch string
const ARCH_MAP = { 0: 'ia32', 1: 'x64', 2: 'armv7l', 3: 'arm64' };
// arch 4 = universal (fat binary) — skip; electron-builder handles lipo itself

// Path of the compiled binary relative to server/ (used to locate the rebuilt file)
const NODE_SRC_REL = 'node_modules/better-sqlite3/build/Release/better_sqlite3.node';
// Path inside the asar.unpacked bundle (server/ prefix is part of the bundle layout)
const NODE_DEST_REL = 'server/node_modules/better-sqlite3/build/Release/better_sqlite3.node';

module.exports = async function afterPack(context) {
  const { appOutDir, packager, arch } = context;
  const archName = ARCH_MAP[arch];

  if (!archName) {
    console.log(`[afterPack] arch enum ${arch} — skipping native rebuild`);
    return;
  }

  // afterPack receives a PlatformPackager; the version lives on packager.info.
  // Fall back to the locally installed electron package if that's also undefined.
  const electronVersion =
    packager.info?.electronVersion ?? require('electron/package.json').version;

  const serverDir = path.join(__dirname, '..', 'server');
  const platformName = packager.platform.name; // 'mac' | 'windows' | 'linux'

  const nodeSrc = path.join(serverDir, NODE_SRC_REL);

  // Back up the system-Node binary before we overwrite it with the Electron
  // build. We'll restore from this after copying into the bundle, so local dev
  // (tsx/node) keeps working. This is more reliable than re-running npm rebuild,
  // which inherits electron-builder's Electron-target npm_config_* env vars.
  const nodeBackup = nodeSrc + '.devbackup';
  if (fs.existsSync(nodeSrc)) {
    fs.copyFileSync(nodeSrc, nodeBackup);
  }

  console.log(`[afterPack] rebuilding better-sqlite3 for ${platformName}/${archName} (Electron ${electronVersion})`);

  await rebuild({
    buildPath: serverDir,
    electronVersion,
    arch: archName,
    force: true,
    onlyModules: ['better-sqlite3'],
  });

  let nodeDest;
  if (platformName === 'mac') {
    const productName = packager.appInfo.productFilename; // e.g. "Chef Aratus Cookbook"
    nodeDest = path.join(
      appOutDir,
      `${productName}.app`,
      'Contents/Resources/app.asar.unpacked',
      NODE_DEST_REL
    );
  } else {
    // Windows / Linux: resources/ sits directly under appOutDir
    nodeDest = path.join(appOutDir, 'resources/app.asar.unpacked', NODE_DEST_REL);
  }

  console.log(`[afterPack] copying better_sqlite3.node → ${path.relative(process.cwd(), nodeDest)}`);
  fs.mkdirSync(path.dirname(nodeDest), { recursive: true });
  fs.copyFileSync(nodeSrc, nodeDest);

  // Restore the system-Node binary from backup so local dev still works.
  if (fs.existsSync(nodeBackup)) {
    console.log('[afterPack] restoring better-sqlite3 system-Node binary');
    fs.copyFileSync(nodeBackup, nodeSrc);
    fs.unlinkSync(nodeBackup);
  } else {
    console.warn('[afterPack] no backup found — run npm install in server/ to restore dev binary');
  }

  console.log('[afterPack] done');
};
