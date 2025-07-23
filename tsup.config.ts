import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/**/*.ts'], // include all files
  format: ['cjs'],                        // use CommonJS to avoid ESM extension issues
  dts: true,                              // generate types
  target: 'es2020',
  outDir: 'dist',
  splitting: false,
  clean: true,
  outExtension: () => ({ js: '.js' })     // ensure .js extensions
});
