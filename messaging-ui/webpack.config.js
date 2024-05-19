const path = require('path');

module.exports = {
  entry: './src/index.js', // Вхідна точка вашого застосунку
  output: {
    filename: 'bundle.js', // Вихідний файл після збірки
    path: path.resolve(__dirname, 'dist'), // Директорія для вихідного файлу
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Використання Babel для транспіляції ES6+ коду в ES5
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // Обробка CSS файлів
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource', // Обробка зображень
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    historyApiFallback: true, // Дозволяє обробляти маршрути SPA
  },
};
