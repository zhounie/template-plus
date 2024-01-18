#!/usr/bin/env node

import { program } from 'commander'
import init from './dist/index.mjs'
import pck from './package.json' assert { type: 'json'}

program
    .version(pck.version)


program
    .command('init')
    .action((name) => {
        init()
    })
    
program.parse()