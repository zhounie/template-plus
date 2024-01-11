import prompts from 'prompts'
import chalk from 'chalk'
import type { PromptObject } from 'prompts'

const defaultProjectName = 'template-plus'

let command = {
  projectName: '',
  templateType: '',
}
let normalizedCommand = {
  normalized: true,
  isHusky: true,
  isEslint: true,
  isStyleLint: true,
  isPrettier: true
}
let toolsCommand = {
  customTools: true,
  axios: true,
  router: true,
  store: true,
}

const commandList = [
  {
    name: 'projectName',
    type: 'text',
    message: '项目名称: ',
    initial: defaultProjectName,
  },
  {
    name: 'templateType',
    message: '模版类型：',
    type: 'select',
    choices: [
      { title: 'vue3-admin', value: 'vue3-admin' },
      { title: 'vue3-h5', value: 'vue3-h5' },
    ]
  },
]

const normalizedList = [
  {
    name: 'normalized',
    message: 'need Normalized code?',
    type: 'toggle',
    initial: normalizedCommand.normalized,
    active: 'yes',
    inactive: 'no',
  },
  {
    name: 'isEslint',
    message: '  need eslint?',
    type: 'toggle',
    initial: normalizedCommand.isEslint,
    active: 'yes',
    inactive: 'no'
  },
  {
    name: 'isStyleLint',
    message: '  need style-lint?',
    type: 'toggle',
    initial: normalizedCommand.isStyleLint,
    active: 'yes',
    inactive: 'no'
  },
  {
    name: 'isPrettier',
    message: '  need prettier?',
    type: 'toggle',
    initial: normalizedCommand.isPrettier,
    active: 'yes',
    inactive: 'no'
  },
  {
    name: 'isHusky',
    message: '  need husky?',
    type: 'toggle',
    initial: normalizedCommand.isHusky,
    active: 'yes',
    inactive: 'no'
  }
]

const toolsList = [
  {
    name: 'customTools',
    message: 'custom tools?',
    type: 'toggle',
    active: 'yes',
    inactive: 'no',
    initial: toolsCommand.customTools,
  },
  {
    name: 'axios',
    message: '  需要Axios?',
    type: 'toggle',
    active: 'yes',
    inactive: 'no',
    initial: toolsCommand.axios,
  },
  {
    name: 'router',
    message: '  需要Router?',
    type: 'toggle',
    active: 'yes',
    inactive: 'no',
    initial: toolsCommand.router,
  },
  {
    name: 'store',
    message: '  需要Store?',
    type: 'toggle',
    active: 'yes',
    inactive: 'no',
    initial: toolsCommand.store,
  }
]

export const getCommand = async () => {
  command = await prompts(commandList, {
    onCancel() {
      throw console.log(chalk.redBright(`已取消`));
    }
  });
  normalizedCommand = await prompts(normalizedList, {
    onSubmit(prompt, answer, answers) {
      if (prompt.name === 'normalized' && answer === false) {
        return true
      }
    },
    onCancel() {
      throw console.log(chalk.redBright(`已取消`));
    }
  });
  toolsCommand = await prompts(toolsList, {
    onSubmit(prompt, answer, answers) {
      if (prompt.name === 'customTools' && answer === false) {
        return true
      }
    },
    onCancel() {
      throw console.log(chalk.redBright(`已取消`));
    }
  })
  return Object.assign(command, {normalizedCommand}, {toolsCommand})
}
