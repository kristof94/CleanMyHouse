export default function(ctx) {
  const { store, req } = ctx
  if (process.server) {
    if (req.session.decodedClaims) {
      store.commit('setUser', req.session.decodedClaims)
      store.commit('setPhoneNumber', req.session.decodedClaims.phoneNumber)
    } else {
      store.commit('setPhoneNumber', null)
      store.commit('setUser', null)
    }
  }
}
