import prompts from 'prompts'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fsExtra from 'fs-extra'
import chalk from 'chalk'

const defaultProjectName = 'template-plus'

async function init() {
  let result = {
    projectName: ''
  }

  const list = [
    {
      name: 'projectName',
      type: 'text',
      message: '项目名称: ',
      initial: defaultProjectName,
    }
  ]
  try {
    result = await prompts(list);
  } catch (error) {
    console.log(error);
  }

  const root = process.cwd()
  
  const resourceDir = path.resolve(fileURLToPath(import.meta.url), '../../', 'template-admin')
  const targetDir = path.resolve(root, result.projectName)

  // 复制文件夹
  fsExtra.copySync(resourceDir, targetDir)

  // 重写package.json
  const pkgPath = path.resolve(targetDir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
  pkg.name = result.projectName
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8')

  // 更改ignore名称
  const gitignore = path.resolve(targetDir, 'gitignore')
  fs.renameSync(gitignore, path.resolve(targetDir, '.gitignore'))

  console.log(chalk.greenBright.bold(`  cd ${result.projectName}`))
  console.log(chalk.greenBright.bold(`  npm install`));
  
}



init().catch((err) => {
  console.log(err);
})