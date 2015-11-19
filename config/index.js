var config = {
  // const
  'INDEX': '主页',

  'LOGIN': '登录',
  'REGISTER': '注册',
  'CHARGE': '充值',

  'CONTAINER': '容器',
  'IMAGE': '镜像',
  'CREATE_CONTAINER': '创建容器',

  'INTERNAL_ERROR': '内部错误',

  'SECRET': 'hardtoguess',

  'mongodb': {
    'host': '127.0.0.1',
    'port': 27017,
    'db': 'dockerci'
  },

  'server': {
    'host': 'http://dockerci.duanpengfei.com'
  }
};

config.mongodb.url = 'mongodb://' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.db;

module.exports = config;
