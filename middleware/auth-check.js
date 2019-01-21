export default function(ctx) {
  const { store, req } = ctx
  if (process.server) {
    if (req.session.decodedClaims) {
      store.commit('setUser', req.session.decodedClaims)
    } else {
      store.commit('setUser', null)
    }
  }
}
