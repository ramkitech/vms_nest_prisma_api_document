import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['cjs'],
  target: 'es2020',
  outDir: 'dist',
  dts: true,
  clean: true,
  splitting: false,
});
