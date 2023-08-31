import prompts from 'prompts'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fsExtra from 'fs-extra'
import chalk from 'chalk'
import crossSpawn from 'cross-spawn'


const root = process.cwd()

const defaultProjectName = 'template-plus'
let targetDir = path.resolve(root, defaultProjectName)

// 合并package.json
function mergePkg (pkg, targetPkg) {
  Object.keys(pkg).forEach(key => {
    if (typeof targetPkg[key] === 'string') {
      targetPkg[key] = pkg[key]
    } else if (Object.prototype.toString.call(targetPkg[key]) === '[object Object]') {
      if (Object.prototype.toString.call(targetPkg[key]) === '[object Object]') {
        targetPkg[key] = Object.assign(targetPkg[key], pkg[key])
      }
    } else {
      targetPkg[key] = pkg[key]
    }
  })
}

function getToolPkg (name) {
  const pkgPath = path.resolve(root, `tools/${name}/`, 'package.json')
  return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
}

function copyToolFile(name) {
  const dir = path.resolve(root, `tools/${name}`, 'src')
  if (fsExtra.existsSync(dir)) {
    fsExtra.copySync(dir, targetDir)
  }
}


function initGit(targetDir) {
  return new Promise((resolve, reject) => {
    const gitInitProcess = crossSpawn.sync('git', ['init'], {
      cwd: targetDir
    })
    if (gitInitProcess.status === 0) {
      console.log(chalk.blueBright(gitInitProcess.stdout.toString()));
      resolve(1)
    } else {
      console.log(chalk.red(gitInitProcess.stderr.toString()));
      rollback(targetDir)
      reject(0)
    }
  })
}

function initHusky(targetDir, pkg) {
  const huskyPkg = getToolPkg('husky')
  mergePkg(huskyPkg, pkg)
  const huskyInstallProcess = crossSpawn.sync('npx', ['husky', 'install'], {
    cwd: targetDir
  })
  if (huskyInstallProcess.status === 0) {
    console.log(chalk.blueBright(huskyInstallProcess.stdout.toString()));
  } else {
    console.log(chalk.red(huskyInstallProcess.stderr.toString()));
    return rollback(targetDir)
  }

  const childProcess = crossSpawn.sync('npx', ['husky', 'add', '.husky/pre-commit', 'npm run lint-staged'], {
    cwd: targetDir
  })
  if (childProcess.status === 0) {
    console.log(chalk.blueBright(childProcess.stdout.toString()));
  } else {
    console.log(chalk.red(childProcess.stderr.toString()));
    return rollback(targetDir)
  }
}

function rollback(dir) {
  fsExtra.removeSync(dir)
}

async function init() {
  let result = {
    projectName: '',
    normalized: true
  }
  let normalizedResult = {
    isHusky: true,
    isEslint: true,
    isStyleLint: true,
    isPrettier: true
  }

  const list = [
    {
      name: 'projectName',
      type: 'text',
      message: '项目名称: ',
      initial: defaultProjectName,
    },
    {

    },
    {
      
    },
    {
      
    },
    {
      name: 'normalized',
      message: 'need Normalized code?',
      type: 'toggle',
      initial: result.normalized,
      active: 'yes',
      inactive: 'no'
    }
  ]

  const normalizedList = [
    {
      name: 'isEslint',
      message: 'need eslint?',
      type: 'toggle',
      initial: normalizedResult.isEslint,
      active: 'yes',
      inactive: 'no'
    },
    {
      name: 'isStyleLint',
      message: 'need style-lint?',
      type: 'toggle',
      initial: normalizedResult.isStyleLint,
      active: 'yes',
      inactive: 'no'
    },
    {
      name: 'isPrettier',
      message: 'need prettier?',
      type: 'toggle',
      initial: normalizedResult.isPrettier,
      active: 'yes',
      inactive: 'no'
    },
    {
      name: 'isHusky',
      message: 'need husky?',
      type: 'toggle',
      initial: normalizedResult.isHusky,
      active: 'yes',
      inactive: 'no'
    }
  ]
  try {
    result = await prompts(list);
    if (result.normalized) {
      normalizedResult = await prompts(normalizedList);
    }
  } catch (error) {
    console.log(error);
  }
  
  const resourceDir = path.resolve(fileURLToPath(import.meta.url), '../../', 'template-admin')
  targetDir = path.resolve(root, result.projectName)

  // 复制文件夹
  fsExtra.copySync(resourceDir, targetDir)

  // 获取package文件
  const pkgPath = path.resolve(targetDir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
  pkg.name = result.projectName

  function initTool(name) {
    console.log(chalk.blueBright(`init ${name}...`));
    const prettierPkg = getToolPkg(name)
    mergePkg(prettierPkg, pkg)
    copyToolFile(name)
    console.log(chalk.blueBright(`init ${name} success.`));
  }

  // 初始化lint-staged
  function initLintStaged (targetDir, pkg) {
    console.log(chalk.blueBright("init lint-staged..."));
    const lintStagedPkg = getToolPkg('lint-staged')
    mergePkg(lintStagedPkg, pkg)
    copyToolFile('lint-staged')

    // "*.{js,ts,vue}": [
    //   "npm run eslint",
    //   "npm run prettier"
    // ],
    // "*.{vue,css,scss}": [
    //   "npm run stylelint"
    // ]
    if (normalizedResult.isEslint) {
      if (Array.isArray(pkg['lint-staged']['*.{js,ts,vue}'])) {
        pkg['lint-staged']['*.{js,ts,vue}'].push('npm run eslint')
      } else {
        pkg['lint-staged']['*.{js,ts,vue}'] = ['npm run eslint']
      }
    }
    if (normalizedResult.isPrettier) {
      if (Array.isArray(pkg['lint-staged']['*.{js,ts,vue}'])) {
        pkg['lint-staged']['*.{js,ts,vue}'].push('npm run prettier')
      } else {
        pkg['lint-staged']['*.{js,ts,vue}'] = ['npm run prettier']
      }
    }
    if (normalizedResult.isStyleLint) {
      pkg['lint-staged']['*.{vue,css,scss}'] = ['npm run stylelint']
    }
    console.log(chalk.blueBright("init lint-staged success."));
  }

  if (result.normalized) {
    if (normalizedResult.isPrettier) {
      initTool('prettier')
    }

    if (normalizedResult.isEslint) {
      initTool('eslint')
    }

    if (normalizedResult.isStyleLint) {
      initTool('stylelint')
    }

    if (normalizedResult.isHusky) {
      // 初始化git
      try {
        await initGit(targetDir)
      } catch (error) {
        console.log(chalk.redBright(error))
      }
      initHusky(targetDir, pkg)
      initLintStaged(targetDir, pkg)
    }
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8')

  // 更改ignore名称
  const gitignore = path.resolve(targetDir, 'gitignore')
  fs.renameSync(gitignore, path.resolve(targetDir, '.gitignore'))

  console.log(chalk.greenBright.bold(`1. cd ${result.projectName}`))
  console.log(chalk.greenBright.bold(`2. npm install`));
  
}



init().catch((err) => {
  rollback(targetDir)
  console.log(err);
})