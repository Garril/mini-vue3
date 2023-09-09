import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

// import pkg from './package.json' assert { type: "json" };
import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

export default {
  input: './src/index.ts', // entry file
  output: [
    {
      format: 'cjs', //output format: amd es6 iife umd cjs
      file: pkg.main, // package files path -- 'lib/guide-mini-vue.cjs.js'
    },
    {
      format: 'es', //output format: amd es6 iife umd cjs
      file: pkg.module, // package files path -- 'lib/guide-mini-vue.esm.js'
    }
  ],
  plugins: [
    // we need parse typescript
    typescript(),
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.ts']
    }),
    json()
  ]
};
