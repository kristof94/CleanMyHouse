export default function(ctx) {
  const { store, res } = ctx
  if (process.server) {
    if (res.locals.decodedClaims) {
      console.log(res.locals)
      store.commit('setUser', res.locals.decodedClaims)
    } else {
      store.commit('setUser', null)
    }
  }
}
