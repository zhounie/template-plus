#!/usr/bin/env node

import { program } from 'commander'
import fs from 'node:fs'
import path from 'node:path'

const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '../package.json'), 'utf-8'))

program
    .version(pkg.version)

program
    .command('init')
    .action(async (name) => {
        await import('./dist/index.mjs')
    })
    
program.parse()