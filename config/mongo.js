exports.configuration = {
  getUri: (env) => {
    return env ? `mongodb://lucas:lucas123@ds237357.mlab.com:37357/heroku_7tb6crwm` : 'mongodb://lucas:lucas123@ds237357.mlab.com:37357/heroku_7tb6crwm'
  }
}