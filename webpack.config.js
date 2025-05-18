const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/main.tsx', // Entry point of your application
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'], // Resolve these extensions
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader', // Use Babel to transpile TS/TSX
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader', // Use Babel for JS/JSX as well
        },
        {
          test: /\.css$/,
          use: [
            'style-loader', // Injects styles into DOM
            'css-loader',   // Translates CSS into CommonJS
            'postcss-loader', // Processes CSS with PostCSS (for Tailwind)
          ],
        },
        { // For handling images or other assets if needed
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html', // Path to your HTML template
        favicon: './public/favicon.ico' // Optional: if you have a favicon
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'), // Serve static files from public
      },
      compress: true,
      port: 3000, // You can choose any port
      hot: true, // Enable Hot Module Replacement
      open: argv.open, // Use the --open flag from the script
      historyApiFallback: true, // For single-page applications
    },
    devtool: isDevelopment ? 'eval-source-map' : 'source-map', // Source maps
  };
};