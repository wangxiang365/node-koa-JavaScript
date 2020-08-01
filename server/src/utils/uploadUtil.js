var fs = require('fs')
var path = require('path')
const send = require('koa-send')
const { array } = require('@hapi/joi')
class uploadTool {
  upload (fileObj) {
    return new Promise((resolve, reject) => {
      // 上传多个个文件
      const files = fileObj.files instanceof Array ? fileObj.files : [fileObj.files]
      const filePathArr = []
      for (let file of files) {
        // 创建可读流
        const reader = fs.createReadStream(file.path)
        let filePath = path.join(__dirname, '../public/upload/') + `${file.name}`
        // 创建可写流
        const upStream = fs.createWriteStream(filePath)
        // 可读流通过管道写入可写流
        filePathArr.push(filePath)
        reader.pipe(upStream)
      }
      resolve({
        images: filePathArr
      })
    })
  }
  download (ctx) {
    // const name = ctx.params.name
    // const path = `upload/${name}`
    // ctx.attachment(path)
    // await send(ctx, path)
    return new Promise(async(resolve, reject) => {
      // 设置实体头（表示消息体的附加信息的头字段）,提示浏览器以文件下载的方式打开
      // 也可以直接设置 ctx.set("Content-disposition", "attachment; filename=" + fileName)
      // ctx.attachment(fileName)
      let file_name = 'index.html'
      ctx.attachment(file_name)
      try {
        await send(ctx, file_name, {root: path.join(__dirname, '../public')})
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}
module.exports = new uploadTool()