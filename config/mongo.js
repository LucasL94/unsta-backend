exports.configuration = {
  getUri: (env) => {
    return env ? `mongodb://<dbuser>:<dbpassword>@ds237357.mlab.com:37357/heroku_7tb6crwm` : 'mongodb://<dbuser>:<dbpassword>@ds237357.mlab.com:37357/heroku_7tb6crwm'
  }
}