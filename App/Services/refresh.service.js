import merge from 'lodash/merge'
import { getItem, setItem, setItems, mergeItem, removeAllItems } from './storage.service';
import base64 from 'react-native-base64';
import { configureRefreshFetch, fetchJSON } from 'refresh-fetch';
import { Linking, Alert } from 'react-native';
import { Env } from "../Utils/enviroments";

const URL = Env.apiUrl;
//Name of storage token
const COOKIE_NAME = 'token'
const COOKIE_NAME_2 = 'tokenOut'


//Function to save token on storage
//const saveToken = async token => { return await setItem(COOKIE_NAME, token) }
const saveToken = async token => { return await setItem(COOKIE_NAME, token) }
const saveToken2 = async token => { return await setItem(COOKIE_NAME_2, token) }

//Function to clear storage
const clear = async (name) => { return await removeAllItems(name) }

//Function to get storage like object
const get = async (name) => {
  let ret = await getItem(name);
  return ret;
}

//Remove token of storage
const clearToken = async () => {
  return removeAllItems(COOKIE_NAME);
}


//Do a fetch with token
const fetchJSONWithToken = async ( url, options = {}) => {
  const token = await get('token');
  let optionsWithToken = options;
  if (token != null || token != "") {
    optionsWithToken = merge(options, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  let response = await fetchJSON(url, optionsWithToken).catch(err => {
    return { error: err };
 });
  return response;
}


const fetchJSONWithtokenOut = async ( url, options = {}) => {
  const tokenOut = await get('tokenOut');
  let optionsWithToken = options;
  if (tokenOut != null || tokenOut != "") {
    optionsWithToken = merge({}, options, {
      headers: {
        Authorization: `Bearer ${tokenOut}`
      }
    })
  }
  let response = await fetchJSON(url, optionsWithToken).catch(err => {
   console.log("errorfetch", err); 
 });
  return response;
}

//Login to get the token
const login = async (email, password, tokenName) => {
  if (tokenName === 'token') {
    const token = await getItem('token')
    const getUser = await getItem('user');
    var headers = new Headers();
    let user = {
      user: email,
      password: password,
    }
    headers.append("Content-Type", "application/json");
    return fetchJSONWithToken( URL + "/users/login", {
      method: 'POST',
      body: JSON.stringify(user),
      headers: headers,
    })
    .then(resp => {
      let body = {
        token: resp ? resp.body.token : token,
        id_user: resp ? resp.body.id_user : getUser ? getUser.id : null
      }
      if (body.token) {
        let result = {
          email: email,
          password: password,
          type: 'correo',
        }
        setItems([['refresh', JSON.stringify(result)]]);
        saveToken(body.token);        
        return body;
      } else {
        restartApp();
        return false;
      }
    }).catch((error) => {
      restartApp();
    });
  }else if (tokenName === 'tokenOut'){
    const token = await getItem('tokenOut')
    const getUser = await getItem('user2');
    var headers = new Headers();
    let user = {
      user: email,
      password: password,
    }
    headers.append("Content-Type", "application/json");
    return fetchJSONWithtokenOut( URL + "/users/login", {
      method: 'POST',
      body: JSON.stringify(user),
      headers: headers,
    })
      .then(resp => {
        let body = {
          token: resp ? resp.body.token : token,
          id_user: resp ? resp.body.id_user : getUser ? getUser.id : null
        }
        if (body.token) {
          let result = {
            email: email,
            password: password,
            type: 'correo'
          }
          setItems([['refresh2', JSON.stringify(result)]]);
          saveToken(body.token);        
          return body;
        } else {
          restartApp();
          return false;
        }
      }).catch((error) => {
        restartApp();
      });
  }
}

const restartApp = () => {
  return logout().then(async (res) => {
    await setItem('isLogged', false);
    return res;
  }).catch((e) => console.log(e))
}


//Close and clear token
const logout = async () => {
  const url = await Linking.getInitialURL();
  await setItem("deepLinkUrl", url);
  return clearToken();
}

//Errors on respose
const shouldRefreshToken = error =>
  error.body == 'Unauthorized.' ||
  error == 'Unauthorized.' ||
  error.body && error.body.error.name == 'UnauthorizedError'


//Do a refresh token and login to set token
const refreshToken = async () => {
  let refresh = await get("refresh");
  //console.log('lo que estea en el cache refresh', refresh);
  switch (refresh.type) {
    case 'correo':
      return login(refresh.email, refresh.password, 'token');
    default:
      return login(refresh.email, refresh.password, 'token');
  }
}

//Functions to fetch on AUTH.SERVICE
const fetch = configureRefreshFetch({
  fetch: fetchJSONWithToken,
  shouldRefreshToken,
  refreshToken,
})

export {
  fetch,
  login,
  clearToken,
  logout,
  refreshToken,
}