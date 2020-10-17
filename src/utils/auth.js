import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token';

const fingerprintKey = 'FINGER_PRINT';

const sensitiveKey = 'user_sensitive';

const bindPhone = 'bind_phone'

const userNameKey = 'user_name'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getFingerprint() {
  return Cookies.get(fingerprintKey);
}

export function getSensitive() {
  // return JSON.parse(Cookies.get(sensitiveKey));
  return Cookies.get(sensitiveKey)
}

export function setFingerprint(fingerprint) {
  return Cookies.set(fingerprintKey, fingerprint)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setSensitive(sensitive) {
  return Cookies.set(sensitiveKey, sensitive)
}

export function removeSensitive() {
  return Cookies.remove(sensitiveKey)
}

export function setHavePhone(havePhone){
  return Cookies.set(bindPhone, havePhone)
}

export function getHavePhone(){
  return Cookies.get(bindPhone)
}

export function setUserName(userName){
  return Cookies.set(userNameKey, userName)
}

export function getUserName(){
  return Cookies.get(userNameKey)
}
