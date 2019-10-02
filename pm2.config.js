module.exports = {
  apps: [
    {
      name: 'my-nav',
      script: 'yarn start',
      env: {
        NODE_ENV: 'production'
      },
      watch: true, //监听模式
    },
  ],
};
