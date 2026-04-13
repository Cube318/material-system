const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // 后端地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  css: {
    loaderOptions: {
      css: {
        // 这里的资源会自动加载到每个组件的样式之前
        additionalResources: [
          './src/styles/dark-mode.css'
        ]
      }
    }
  }
})