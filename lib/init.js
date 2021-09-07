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


const promptList = [{
    type: 'input',
    message: "请输入要代理的地址：",
    name: "origin",
    validate: function(val) {
        let done = this.async();
        if(val) {
            done(null, true);
            return;
        }
        done("请输入地址");
    }
},{
    type: 'input',
    message: "服务的端口：",
    name: "port",
    validate: function(val) {
        let done = this.async();
        if(val) { 
            done(null, true);
            return;
        }
        done("请输入端口");
    }
},{
    type: 'input',
    message: "地址前缀：",
    name: "path",
    default: 'api',
    validate: function(val) {
        let done = this.async();
        if(val) { 
            done(null, true);
            return;
        }
        done("请输入前缀");
    }
}];

/**
 * @param {string} origin - 要代理的地址
 * 
*/
module.exports = async () => {
    try {
        clear() // 清空记录
        const text = await figlet('node-proxy-cli') // 打印文字
        log(text)

        const answers = await inquirer.prompt(promptList) // 选择要下载的模板 询问返回的结果

        console.log(answers)

        let {origin, port, path} = answers
        
        serve(origin, port, path)

        log(`代理的目标地址：${origin}`)

    } catch (error) {
        console.log(chalk.red(error))
    }

}

