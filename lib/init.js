const {promisify} = require('util')
const inquirer = require('inquirer'); // 询问者  命令行的交互
const figlet = promisify(require('figlet')) // 打印的文字页面 异步方法（promisi）

const clear = require('clear') // 清空记录
const chalk = require('chalk') // 粉笔  文字颜色

const log = content => console.log(chalk.green(content)) // 

const {spawn} = require('child_process') // 子进程

const serve = require('./serve') // 服务的主要代码

// 下载之后自动安装依赖
/**
 * @param {string} args[0] - 执行的命令
 * @param {Array}  args[1] - 执行命令的参数
 * @param {Object}  args[2] - 项目的名称 （在哪里去运行命令）
*/
const spawnFn = async (...args) => {
    return new Promise( resolve =>{
        const proc = spawn(...args) // 
        proc.stdout.pipe(process.stdout)
        proc.stderr.pipe(process.stderr)
        proc.on('close',(code) =>{
            resolve(code)
        })
    })
}

/**
 * @param {string} origin - 要代理的地址
 * 
*/
module.exports = async (origin,port) => {
    try {
        clear() // 清空记录
        const text = await figlet('node-proxy-cli') // 打印文字
        log(text)
        
        serve(origin,port)
        log(`代理的目标地址：${origin}`)

    } catch (error) {
        console.log(chalk.red(error))
    }

}

