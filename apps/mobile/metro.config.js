const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Permite ao Metro observar e resolver pacotes do monorepo pnpm (@ygeia/domain-core, etc.)
config.watchFolders = [monorepoRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Fallback explícito para módulos do babel no pnpm
const pnpmBabelRuntime = path.resolve(
  monorepoRoot,
  'node_modules/.pnpm/@babel+runtime@7.29.15/node_modules/@babel/runtime'
);

config.resolver.extraNodeModules = {
  ...(fs.existsSync(pnpmBabelRuntime) ? { '@babel/runtime': pnpmBabelRuntime } : {}),
};

config.resolver.disableHierarchicalLookup = false;

module.exports = config;
