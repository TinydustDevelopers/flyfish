var config = {
  // const
  'INDEX': '主页',

  'LOGIN': '登录',
  'REGISTER': '注册',

  'INTERNAL_ERROR': '内部错误',

  'SECRET': 'hardtoguess',

  'mongodb': {
    'host': '127.0.0.1',
    'port': 27017,
    'db': 'dockerci'
  }
};

config.mongodb.url = 'mongodb://' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.db;

module.exports = config;