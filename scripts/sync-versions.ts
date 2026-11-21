import fs from 'fs';
import path from 'path';

/**
 * Script de Sincronização de Versão Centralizada do Ygeía
 * Lê o campo "version" do package.json raiz e sincroniza com todos os subprojetos e o app.json mobile.
 */

const rootDir = path.resolve(__dirname, '..');
const rootPkgPath = path.join(rootDir, 'package.json');

if (!fs.existsSync(rootPkgPath)) {
  console.error('[ERRO] package.json raiz não encontrado.');
  process.exit(1);
}

const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
const currentVersion = rootPkg.version;

console.log(`\n======================================================`);
console.log(`  [YGEÍA] Sincronizando Versão Central: v${currentVersion}`);
console.log(`======================================================\n`);

const targetPackages = [
  'apps/api/package.json',
  'apps/web/package.json',
  'apps/mobile/package.json',
  'packages/domain-core/package.json',
  'packages/validation-schemas/package.json',
  'packages/api-client/package.json',
  'packages/typescript-config/package.json'
];

targetPackages.forEach((relativePkgPath) => {
  const fullPkgPath = path.join(rootDir, relativePkgPath);
  if (fs.existsSync(fullPkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(fullPkgPath, 'utf8'));
    pkg.version = currentVersion;
    fs.writeFileSync(fullPkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`  ✓ ${relativePkgPath} -> v${currentVersion}`);
  }
});

// Sincroniza app.json do Expo (React Native Mobile)
const appJsonPath = path.join(rootDir, 'apps/mobile/app.json');
if (fs.existsSync(appJsonPath)) {
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  if (appJson.expo) {
    appJson.expo.version = currentVersion;
    fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
    console.log(`  ✓ apps/mobile/app.json (expo.version) -> v${currentVersion}`);
  }
}

console.log(`\n[SUCESSO] Todas as aplicações e pacotes sincronizados na versão v${currentVersion}.\n`);
