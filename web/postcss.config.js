module.exports = {
  plugins: {
    // 'autoprefixer': {
    //   browsers: ['Android >= 4.0', 'iOS >= 7']
    // },
    // 'postcss-pxtorem': {
    //   rootValue: 100,
    //   propList: ['*'],
    //   selectorBlackList: ['van', 'node_modules']
    // },
    'postcss-px2rem-exclude': {
      remUnit: 100,
      exclude: /node_modules|folder_name/i
    }
  }
}
