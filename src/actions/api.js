import {AsyncStorage} from 'react-native'
import Global from 'src/Global'
import NavigationService from 'actions/NavigationService'

const fetchApi = async(method, path, params={}, token) => {
  let finalPath = path
  let options = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${Global.userToken}`
    }
  }

  if (method.toUpperCase() === 'GET') {
    finalPath += '?' + Object.entries(params).map((v) => {
        if (Array.isArray(v[1])){
        return `${v[0]}=${v[1].join(',')}`
      } else {
        return `${v[0]}=${v[1]}`
      }
    }).join('&')
  } else {
    options['body'] = JSON.stringify(params)
  }

  console.log(Global.apiUrl + `${finalPath}`)
  return await fetch (Global.apiUrl + `${finalPath}`, options).then(res => {
    console.log(res)
    return res.json()
  }).then(response => {
    if(response.status == 'fail' && response.data == 'Unauthenticated.'){
      Global.userToken = null
      AsyncStorage.removeItem('@USER_TOKEN')

      NavigationService.reset('LoginView')
      return
    }

    return response
  }).catch(err => {
    console.info("__err__", err)
  })
}

const fetchUnlengthApi = async(method, path, params={}, token) => {
  let finalPath = path
  let options = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `JWT ${Global.userToken}`
    }
  }

  if (method.toUpperCase() === 'GET') {
    finalPath += '?' + Object.entries(params).map((v) => {
      if (Array.isArray(v[1])){
      return `${v[0]}=${v[1].join(',')}`
    } else {
      return `${v[0]}=${v[1]}`
    }
  }).join('&')
  } else {
    var formData = new FormData();
    for (var k in params) {
      formData.append(k, params[k]);
    }
    options['body'] = formData
  }

  return await fetch (Global.apiUrl + `${finalPath}`, options).then(res => {
    return res.json()
  }).then(response => {
    if(response.status == 'fail' && response.data == 'Unauthenticated.'){
      Global.userToken = null
      AsyncStorage.removeItem('@USER_TOKEN')

      NavigationService.reset('LoginView')
      return
    }

    return response
  }).catch(err => {
    console.info("__err__", err)
  })
}

const fetchApiLogin = async(method, path, params={}) => {
    let finalPath = path
    let options = {
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
        }
    }

    if (method.toUpperCase() === 'GET') {
        finalPath += '?' + Object.entries(params).map((v) => {
            if (Array.isArray(v[1])){
                return `${v[0]}=${v[1].join(',')}`
            } else {
                return `${v[0]}=${v[1]}`
            }
        }).join('&')
    } else {
        options['body'] = JSON.stringify(params)
    }
    
    return await fetch (Global.apiUrl + `${finalPath}`, options).then(res => {
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
  fetchApiLogin,
  setToken,
  isLoggedIn
}