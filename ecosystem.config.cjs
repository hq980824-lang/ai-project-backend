/**
 * PM2 启动时默认没有 NODE_ENV，会导致只尝试加载 .env.undefined / .env，
 * 读不到 .env.production，从而出现 MySQL user ''@'localhost'。
 * 部署：在应用根目录执行 pm2 startOrReload ecosystem.config.cjs
 */
module.exports = {
  apps: [
    {
      name: 'nest-api',
      cwd: __dirname,
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
