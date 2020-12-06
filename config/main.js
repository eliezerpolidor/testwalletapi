var config = {
    'development': {
        'database': 'mongodb://localhost:27017/mywalletdb',
        'port': '3001',
        'host': 'http://0.0.0.0',
        'secret': '5FF8FBAB34909B65905C5EEA63C30B5C8BD7EAE85A23D1DB1C780028FF6295CD'
    }
}

exports.get = function(env) {
    //env = "test";
    return config[env] || config.development;
}
