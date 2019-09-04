const baseUrl = 'https://orchid.ipconfigure.com/service'

const getCams = (userSessionId, http) => {
  console.log(userSessionId)
  const params = {
    sid: userSessionId,
    live: true
  }
  const url = baseUrl + '/streams'
  let headers = new Headers({'Content-Type': 'application/json'});  
  headers.append('Authorization','Bearer ' + userSessionId)
  let options = new RequestOptions({headers: headers});
  http.get(url, JSON.stringify(params), options).then((resp) => {
    if (resp.data) {
      console.log(JSON.stringify(resp.data))
    } else {
      console.log('error getting streams with ' + JSON.stringify(params))
    }
  }).catch((error) => { console.log('error with session: ' + userSessionId + '. Error is ' + JSON.stringify(error))})
}

const authorizeUserSession = (scope, http) => {
  scope.msg = 'Ready...'
  const url = baseUrl + '/sessions/user'
  const data = {
    username: 'liveviewer',
    password: 'tpain',
    expiresIn: 6000,  // 10 minutes
    cookie: 'session'
  }
  http.post(url, JSON.stringify(data)).then((resp) => {
    if (resp.data) {
      scope.msg = `Logged In (${data.username})`
      console.log(JSON.stringify(resp.data))
      getCams(resp.data.id, http)
    }
  }, (resp) => {
    scope.msg = 'An Error Occurred. Detail: ' + JSON.stringify(resp)
  })
}

angular.module('camsApp', []).controller('CamsController', ($scope, $http) => {
  authorizeUserSession($scope, $http)
})
