module.exports = function(admin) {
  function checkCookieSession(req, sessionCookie) {
    return admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(decodedData => {
        const decodedClaims = {
          uid: decodedData.uid,
          email: decodedData.email,
          emailVerified: decodedData.email_verified,
          phoneNumber: decodedData.phone_number
        }
        req.session.decodedClaims = decodedClaims
      })
  }

  return {
    checkCookieSession: checkCookieSession
  }
}
