import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['esm'],
  target: 'es2020',
  dts: true,
  outDir: 'dist',
  splitting: false,
  clean: true,
  sourcemap: false,
});
