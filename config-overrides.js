const { override, addBabelPlugin, addWebpackModuleRule } = require("customize-cra");

module.exports = override(
  addBabelPlugin("styled-jsx/babel"),
  addWebpackModuleRule({
    test: /\.css$/,
    use: [{
      loader: require('styled-jsx/webpack').loader,
      options: {
        type: 'scoped'
      }
    }]
  }),
  addWebpackModuleRule({
    test: /\.(vs|fs)$/i,
    use: ['babel-loader']
  }),
  addWebpackModuleRule({
    test: /\.(vert|frag)$/i,
    exclude: /node_modules/,
    use: [
      'raw-loader',
      'glslify-loader'
    ]
  }),
  addWebpackModuleRule({
    test: /\.(txt|csv)$/,
    exclude: /node_modules/,
    use: ['raw-loader']
  })
);
