export default function({ route, $axios, store, env }) {
  if (process.server) {
    if (route.name === 'book') {
      console.log('ici')
      console.log(process.env.PORT)
      console.log(env.PORT)
      console.log('la')
      return $axios.get('/verifySession').catch(err => {
        console.log(err.response ? err.response.status : 'no status')
        if (err.response == null || err.response.status == null) {
          store.commit('setError', {
            code: 500,
            header: 'Vous devez être connecté pour accéder à cette page.',
            message: 'Vous allez être redirigé vers une page de reconnexion.'
          })
        } else if (err.response.status == 401) {
          store.commit('setError', {
            code: err.response.status,
            header: 'Votre session a expiré.',
            message: 'Vous allez être redirigé vers une page de reconnexion.'
          })
        } else if (err.response.status == 403) {
          store.commit('setError', {
            code: err.response.status,
            header: 'Vous devez être connecté pour accéder à cette page.',
            message: 'Vous allez être redirigé vers une page de reconnexion.'
          })
        }
      })
    }
  }
}
