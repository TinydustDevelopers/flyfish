var config = {
  'language': {
    // const
    'INDEX': '主页',

    'LOGIN': '登录',
    'REGISTER': '注册',
    'CHARGE': '充值',

    'RUNNING_CONTAINER': '已运行的容器',
    'CREATED_CONTAINER': '已创建的容器',
    'CONTAINER_INFO': '容器详细信息',

    'IMAGE': '镜像',
    'DOWNLOADED_IMAGE': '已下载的镜像',
    'CREATE_CONTAINER': '创建容器',

    'INTERNAL_ERROR': '内部错误',
  },

  'SECRET': 'hardtoguess',

  'mongodb': {
    'host': '127.0.0.1',
    'port': 27017,
    'db': 'dockerci'
  },

  'server': {
    'host': 'http://dockerci.duanpengfei.com',
    'ip': '207.226.141.72'
  },

  'docker': {
    'api': {
      'ip': '207.226.141.72',
      'port': 2375
    }
  },

  'repo': {
    'location': '/root/docker_ci_repo'
  }
};

config.mongodb.url = 'mongodb://' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.db;

module.exports = config;
