export default function({ route, $axios, store }) {
  if (process.server) {
    if (route.name === 'book') {
      return $axios.get('/verifySession').catch(err => {
        console.log(err.response)
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
