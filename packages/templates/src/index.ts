import prompts from 'prompts'
import fs from 'node:fs'
import path from 'node:path'
import fsExtra from 'fs-extra'

const defaultProjectName = 'create-vue3-app'

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

  // console.log(result); // => { value: 24 }

  // console.log(__dirname);

  const resourceDir = path.resolve(__dirname, '../', 'template-admin')
  const targetDir = path.resolve(__dirname, result.projectName)

  // 复制文件夹
  fsExtra.copySync(resourceDir, targetDir)

  // 重写package.json
  const pkgPath = path.resolve(targetDir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
  pkg.name = result.projectName
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8')

  console.log(`cd ${result.projectName}`)
  console.log(`npm install`);
  
}



init().catch((err) => {
  console.log(err);
})