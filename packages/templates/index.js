#!/usr/bin/env node

import { program } from 'commander'
import init from './dist/index.mjs'

program
    .command('init')
    .action((name) => {
        init()
    })
    
program.parse()