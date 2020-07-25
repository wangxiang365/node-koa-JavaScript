let publicPath = process.env.NODE_ENV === 'production' ? '/lzwl-points/' : '/lzwl-points/'
const Timestamp = new Date().getTime()
module.exports = {
  publicPath: publicPath,
  assetsDir: 'static',
  outputDir: process.env.outputDir,
  productionSourceMap: true,
  // 是否在保存的时候使用 `eslint-loader` 进行检查。
  // 有效的值：`ture` | `false` | `"error"`
  // 当设置为 `"error"` 时，检查出的错误会触发编译失败。
  lintOnSave: 'error',
  devServer: {
    disableHostCheck: true,
    host: '192.168.31.82',
    port: 8080,
    https: false,
    hotOnly: false,
    open: true,
    before: app => {}
 },
 configureWebpack: { // webpack 配置
    output: { // 输出重构
      filename: `static/js/[name].${Timestamp}.js`,
      chunkFilename: `static/js/[name].${Timestamp}.js`
    }
  }
}