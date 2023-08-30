import prompts from 'prompts'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fsExtra from 'fs-extra'
import chalk from 'chalk'
import crossSpawn from 'cross-spawn'


const root = process.cwd()

const defaultProjectName = 'template-plus'

// 合并package.json
function mergePkg (pkg, targetPkg) {
  Object.keys(pkg).forEach(key => {
    if (typeof targetPkg[key] === 'string') {
      targetPkg[key] = pkg[key]
    } else if (Object.prototype.toString.call(targetPkg[key]) === '[object Object]') {
      if (Object.prototype.toString.call(targetPkg[key]) === '[object Object]') {
        targetPkg[key] = Object.assign(targetPkg[key], pkg[key])
      } else {
        targetPkg[key] = pkg[key]
      }
    }
  })
}


// 初始化lint-staged
function initLintStaged (targetDir, pkg) {
  const lintStagedDir = path.resolve(root, 'tools/lint-staged')
  const lintStagedPkgPath = path.resolve(lintStagedDir, 'package.json')
  const lintStagedPkg = JSON.parse(fs.readFileSync(lintStagedPkgPath, 'utf-8'))

  console.log(chalk.blueBright("init lint-staged..."));
  // pkg.scripts = Object.assign(pkg.scripts, lintStagedPkg.scripts)
  // pkg.devDependencies = Object.assign(pkg.devDependencies, lintStagedPkg.devDependencies)
  
  mergePkg(lintStagedPkg, pkg)
  console.log(chalk.blueBright("init lint-staged success."));
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
  const huskyDir = path.resolve(root, 'tools/husky')
  const huskyPkgPath = path.resolve(huskyDir, 'package.json')
  const huskyPkg = JSON.parse(fs.readFileSync(huskyPkgPath, 'utf-8'))
  
  mergePkg(huskyPkg, pkg)
  // pkg.scripts = Object.assign(pkg.scripts, huskyPkg.scripts)
  // pkg.devDependencies = Object.assign(pkg.devDependencies, huskyPkg.devDependencies)
  
  const huskyInstallProcess = crossSpawn.sync('npx', ['husky', 'install'], {
    cwd: targetDir
  })
  if (huskyInstallProcess.status === 0) {
    console.log(chalk.blueBright(huskyInstallProcess.stdout.toString()));
  } else {
    console.log(chalk.red(huskyInstallProcess.stderr.toString()));
    return rollback(targetDir)
  }

  const childProcess = crossSpawn.sync('npx', ['husky', 'add', '.husky/pre-commit', 'npm lint-staged'], {
    cwd: targetDir
  })
  if (childProcess.status === 0) {
    console.log(chalk.blueBright(childProcess.stdout.toString()));
  } else {
    console.log(chalk.red(childProcess.stderr.toString()));
    return rollback(targetDir)
  }
}


function initPrettier(targetDir, pkg) {
  const prettierDir = path.resolve(root, 'tools/prettier')
  const prettierPkgPath = path.resolve(prettierDir, 'package.json')
  const prettierPkg = JSON.parse(fs.readFileSync(prettierPkgPath, 'utf-8'))

  console.log(chalk.blueBright("init prettier..."));

  mergePkg(prettierPkg, pkg)
  
  // pkg.scripts = Object.assign(pkg.scripts, prettierPkg.scripts)
  // pkg.devDependencies = Object.assign(pkg.devDependencies, prettierPkg.devDependencies)

  fsExtra.copySync(path.resolve(prettierDir, 'src'), targetDir)

  console.log(chalk.blueBright("init prettier success."));
}

function initEslint(targetDir, pkg) {
  const eslintDir = path.resolve(root, 'tools/eslint')
  const eslintPkgPath = path.resolve(eslintDir, 'package.json')
  const eslintPkg = JSON.parse(fs.readFileSync(eslintPkgPath, 'utf-8'))

  console.log(chalk.blueBright("init eslint..."));
  
  
  mergePkg(eslintPkg, pkg)
  
  // pkg.scripts = Object.assign(pkg.scripts, eslintPkg.scripts)
  // pkg.devDependencies = Object.assign(pkg.devDependencies, eslintPkg.devDependencies)

  fsExtra.copySync(path.resolve(eslintDir, 'src'), targetDir)

  console.log(chalk.blueBright("init eslint success."));
}

function initStylelint(targetDir, pkg) {
  const stylelintDir = path.resolve(root, 'tools/stylelint')
  const stylelintPkgPath = path.resolve(stylelintDir, 'package.json')
  const stylelintPkg = JSON.parse(fs.readFileSync(stylelintPkgPath, 'utf-8'))

  console.log(chalk.blueBright("init stylelint..."));
  
  
  mergePkg(stylelintPkg, pkg)
  
  // pkg.scripts = Object.assign(pkg.scripts, stylelintPkg.scripts)
  // pkg.devDependencies = Object.assign(pkg.devDependencies, stylelintPkg.devDependencies)

  fsExtra.copySync(path.resolve(stylelintDir, 'src'), targetDir)

  console.log(chalk.blueBright("init stylelint success."));
}

function rollback(dir) {
  fsExtra.removeSync(dir)
}

async function init() {
  let result = {
    projectName: '',
    isHusky: true
  }

  const list = [
    {
      name: 'projectName',
      type: 'text',
      message: '项目名称: ',
      initial: defaultProjectName,
    },
    {
      name: 'isHusky',
      message: 'need husky?',
      type: 'toggle',
      initial: result.isHusky,
      active: 'yes',
      inactive: 'no'
    }
  ]
  try {
    result = await prompts(list);
  } catch (error) {
    console.log(error);
  }
  
  const resourceDir = path.resolve(fileURLToPath(import.meta.url), '../../', 'template-admin')
  const targetDir = path.resolve(root, result.projectName)

  // 复制文件夹
  fsExtra.copySync(resourceDir, targetDir)

  // 获取package文件
  const pkgPath = path.resolve(targetDir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
  pkg.name = result.projectName

  
  // 初始化git
  try {
    await initGit(targetDir)
  } catch (error) {
    console.log(chalk.redBright(error))
  }

  initLintStaged(targetDir, pkg)
  

  // 安装husky
  if (result.isHusky) {
    initHusky(targetDir, pkg)
  }

  initPrettier(targetDir, pkg)

  initEslint(targetDir, pkg)

  initStylelint(targetDir, pkg)

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8')

  // 更改ignore名称
  const gitignore = path.resolve(targetDir, 'gitignore')
  fs.renameSync(gitignore, path.resolve(targetDir, '.gitignore'))

  console.log(chalk.greenBright.bold(`1. cd ${result.projectName}`))
  console.log(chalk.greenBright.bold(`2. npm install`));
  
}



init().catch((err) => {
  console.log(err);
})