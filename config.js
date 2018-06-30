var adminUser = {
  name: process.env.BASIC_USER || 'ypkbk',
  pass: process.env.BASIC_PASS || 'ypkbk'
}

var config = {
  local: {
    mode: 'local',
    port: 3000,
    adminUser: adminUser
  },
  testing: {
    mode: 'testing',
    port: 4000,
    adminUser: adminUser
  },
  prod: {
    mode: 'prod',
    port: process.env.PORT || 5000,
    adminUser: adminUser
  }
}

module.exports = function (mode) {
  return config[mode || process.argv[2] || 'local'] || config.local
}
