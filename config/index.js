var config = {
  'language': {
    // const
    'INDEX': '主页',

    'LOGIN': '登录',
    'REGISTER': '注册',
    'CHARGE': '充值',

    'RUNNING_CONTAINER': '已追踪的容器',
    'CREATED_CONTAINER': '已创建的容器',
    'CONTAINER_INFO': '容器详细信息',

    'IMAGE': '镜像',
    'DOWNLOADED_IMAGE': '已下载的镜像',
    'CREATE_CONTAINER': '创建容器',

    'INTERNAL_ERROR': '内部错误',
  },

  'SECRET': 'hardtoguess',

  'mongodb': {
    'host': 'mongodb',
    'port': 27017,
    'db': 'dockerci'
  },

  'server': {
    'host': 'http://int.tinydust.cn',
    'port': 30032,
    'ip': '209.9.106.252'
  },

  'docker': {
    'api': {
      'ip': 'int.tinydust.cn',
      'port': 2375
    }
  }
};

config.mongodb.url = 'mongodb://' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.db;

module.exports = config;
