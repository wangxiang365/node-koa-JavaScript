var fs = require('fs')
var path = require('path')
const send = require('koa-send')
class uploadTool {
  upload (obj) {
    return new Promise((resolve, reject) => {
      // 上传多个个文件
      const files = obj.files.file
      for (let file of files) {
        // 创建可读流
        const reader = fs.createReadStream(file.path)
        // let filePath = path.join(__dirname, '../static/upload/') + `/${file.name}`
        var newFilename = file.name.split('.')[0] + '_' + myDate.getTime() + '.' + file.name.split('.')[1]
        var targetPath = path.join(__dirname, '../public/upload/') + `/${newFilename}`
        // 创建可写流
        const upStream = fs.createWriteStream(targetPath)
        // 可读流通过管道写入可写流
        reader.pipe(upStream)
      }
      resolve({
        url: 'http://' + ctx.headers.host + '/upload/' + newFilename
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