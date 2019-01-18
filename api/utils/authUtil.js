export function clearCookie(res) {
  if (res) {
    res.clearCookie('session')
    res.clearCookie('idToken')
  }
}
