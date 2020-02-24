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
    use: 'raw-loader',
  })
);
