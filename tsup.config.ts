import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',                // Main index
    'src/core/**/*.ts',            // All core files
    'src/services/**/*.ts',        // All services
    'src/zod/**/*.ts',             // All zod files
  ],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  target: 'es2020',
  splitting: false,
  clean: true,
  dts: true,
  esbuildOptions(options) {
    options.outbase = 'src';      // 👈 Preserve folders like core/, services/, zod/
  }
});
