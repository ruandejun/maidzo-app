import Global from 'src/Global'
import NavigationService from 'actions/NavigationService'

const fetchApi = async (method, path, params = {}, token) => {
  let finalPath = path
  let options = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${Global.userToken}`
    }
  }

  if (method.toUpperCase() === 'GET') {
    finalPath += '?' + Object.entries(params).map((v) => {
      if (Array.isArray(v[1])) {
        return `${v[0]}=${v[1].join(',')}`
      } else {
        return `${v[0]}=${v[1]}`
      }
    }).join('&')
  } else {
    options['body'] = JSON.stringify(params)
  }

  // console.log(Global.apiUrl + `${finalPath}`)
  return await fetch(Global.apiUrl + `${finalPath}`, options).then(res => {
    // console.log(res)
    return res.json()
  }).then(response => {
    return response
  }).catch(err => {
    console.info("__err__", err)
  })
}

const fetchUnlengthApi = async (method, path, params = {}, token) => {
  let finalPath = path
  let options = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Token ${Global.userToken}`
    }
  }

  if (method.toUpperCase() === 'GET') {
    finalPath += '?' + Object.entries(params).map((v) => {
      if (Array.isArray(v[1])) {
        return `${v[0]}=${v[1].join(',')}`
      } else {
        return `${v[0]}=${v[1]}`
      }
    }).join('&')
  } else {
    options['body'] = Object.keys(params).map(function (keyName) {
      return encodeURIComponent(keyName) + '=' + encodeURIComponent(params[keyName])
    }).join('&')

    // var formData = new FormData();
    // for (var k in params) {
    //   formData.append(k, params[k]);
    // }
    // options['body'] = formData
  }

  // console.log(Global.apiUrl + `${finalPath}`)
  // console.log(options)

  return await fetch(Global.apiUrl + `${finalPath}`, options).then(res => {
    return res.json()
  }).then(response => {
    return response
  }).catch(err => {
    console.info("__err__", err)
  })
}

const fetchApiLogin = async (method, path, params = {}) => {
  let finalPath = path
  let options = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
    }
  }

  if (method.toUpperCase() === 'GET') {
    finalPath += '?' + Object.entries(params).map((v) => {
      if (Array.isArray(v[1])) {
        return `${v[0]}=${v[1].join(',')}`
      } else {
        return `${v[0]}=${v[1]}`
      }
    }).join('&')
  } else {
    options['body'] = JSON.stringify(params)
  }

  // console.log(Global.apiUrl + `${finalPath}`, options)

  return await fetch(Global.apiUrl + `${finalPath}`, options).then(res => {
    return res.json()
  }).then(response => {
    return response
  }).catch(err => {
    console.info("__err__", err)
  })
}

const fetchUploadApi = async (path, imgfile) => {
  let finalPath = path
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Token ${Global.userToken}`
    }
  }

  var body = new FormData();
  if (imgfile) {
    body.append('imgfile', imgfile);
  }

  options['body'] = body

  return await fetch(Global.apiUrl + `${finalPath}`, options).then(res => {
    if (res.status >= 400) return false

    return res.json()
  }).then(response => {
    return response
  }).catch(err => {
    console.info("__err__", err)
  })
}

const fetchUnlengthApiLogin = async (method, path, params = {}) => {
  let finalPath = path
  let options = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  if (method.toUpperCase() === 'GET') {
    finalPath += '?' + Object.entries(params).map((v) => {
      if (Array.isArray(v[1])) {
        return `${v[0]}=${v[1].join(',')}`
      } else {
        return `${v[0]}=${v[1]}`
      }
    }).join('&')
  } else {
    options['body'] = Object.keys(params).map(function (keyName) {
      return encodeURIComponent(keyName) + '=' + encodeURIComponent(params[keyName])
    }).join('&')
  }

  return await fetch(Global.apiUrl + `${finalPath}`, options).then(res => {
    return res.json()
  }).then(response => {
    return response
  }).catch(err => {
    console.info("__err__", err)
  })
}

const setToken = (token) => {
  localStorage.setItem('dt_token', token)
}

const isLoggedIn = () => {
  return !!localStorage.getItem('dt_token')
}

export {
  fetchApi,
  fetchUnlengthApi,
  fetchUnlengthApiLogin,
  fetchApiLogin,
  fetchUploadApi,
  setToken,
  isLoggedIn
}