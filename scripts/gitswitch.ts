/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

function isValidGitUrl (url: string) {
  const gitRepoRegex = /^(https?:\/\/[^\s/]+\/[^\s/]+\/[^\s/]+\.git|git@[^\s/]+:[^\s/]+\/[^\s/]+\.git)$/
  return gitRepoRegex.test(url)
}

function getRepoName (url: string) {
  // 移除末尾的 .git 后缀(如果有)
  url = url.replace(/\.git$/, '')

  // 移除末尾的斜杠(如果有)
  url = url.replace(/\/$/, '')

  // 获取最后一个斜杠或冒号后的内容
  return url.split(/[/:]/).pop()
}

let url = process.argv[2]

// 获取当前工作目录下 package.json 的完整路径
const packagePath = path.join(process.cwd(), 'package.json')

const htmlPath = path.join(process.cwd(), 'index.html')

let packageJson

try {
  // 同步读取文件内容
  const content = fs.readFileSync(packagePath, 'utf8')

  // 将JSON字符串转换为对象
  packageJson = JSON.parse(content)
} catch (err) {
  console.error('读取文件出错:', err)
}

if (!url) {
  console.log('未输入url参数，将从package.json中获取url')
  url = packageJson.repository || ''
}

if (!isValidGitUrl(url)) {
  console.log('请使用正确的git仓库地址!')
  process.exit(1)
}

try {
  // 查看当前远程仓库
  console.log('当前远程仓库:')
  console.log(execSync('git remote -v').toString())

  // 更改远程仓库地址
  execSync(`git remote set-url origin ${url}`)

  // 确认更改
  console.log('\n更改后的远程仓库:')
  console.log(execSync('git remote -v').toString())
} catch (err) {
  console.error('执行出错:', err)
}

const repoName = getRepoName(url)

try {
  packageJson.name = repoName
  packageJson.repository = url

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8')

  console.log('package.json 已更新')
} catch (err) {
  console.error('更新package.json失败:', err)
}

try {
  const content = fs.readFileSync(htmlPath, 'utf8')
  const $ = cheerio.load(content)
  $('title').text(repoName)
  fs.writeFileSync(htmlPath, $.html())
  console.log('html title已更新')
} catch (err) {
  console.log('html更新失败:', err)
}
