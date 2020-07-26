var fs = require('fs')
var path = require('path')

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
}
module.exports = new uploadTool()