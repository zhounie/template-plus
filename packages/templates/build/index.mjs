import * as esbuild from 'esbuild'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.resolve(fileURLToPath(import.meta.url), '../')

await esbuild.build({
    bundle: true,
    entryPoints: [path.resolve(__dirname, '../src/index.ts')],
    platform: 'node',
    outfile: './dist/out.js',
    format: "esm"
})