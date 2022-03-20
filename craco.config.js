// craco.config.js
const path = require('path');
const resolve = (dir) => path.resolve(__dirname, dir);
module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  webpack: {
    alias: {
      '@': resolve('src'),
    },
  },
};
