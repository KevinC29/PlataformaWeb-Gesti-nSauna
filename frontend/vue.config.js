const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

// module.exports = defineConfig({
//   transpileDependencies: true,
//   devServer: {
//     port: 8081, // Cambia el puerto del servidor de desarrollo
//     proxy: 'http://localhost:3001', // Configura un proxy para evitar problemas con CORS
//   },
// });