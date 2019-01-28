exports.clearCookie = function clearCookie(res) {
  if (res) {
    res.clearCookie('session')
    res.clearCookie('idToken')
  }
}
