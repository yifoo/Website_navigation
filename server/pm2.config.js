'use strict';
module.exports = {
  apps: [
    {
      name: 'node_server',
      script: 'npm start',
      env: {
        NODE_ENV: 'prod',
      },
      watch: false, // 监听模式
    },
  ],
};
