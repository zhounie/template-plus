import { rollup } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import path from 'path'

function build() {
    console.log();
    rollup({
        
        input: path.resolve(import.meta.url, '../../src/index.ts') ,
        output: {
            file: "outfile.js",
            format:"esm"
        },
        plugins: [
            typescript()
        ]
    })
}


build()