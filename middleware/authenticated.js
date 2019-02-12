export default function({ route, $axios, store }) {
  if (route.name === 'book' || route.name === 'profile') {
    return $axios.get('/verifySession').catch(err => {
      if (err.response == null || err.response.status == null) {
        store.commit('setError', {
          code: 500,
          header: 'Vous devez être connecté pour accéder à cette page.',
          message: 'Vous allez être redirigé vers une page de reconnexion.'
        })
      } else if (err.response.status == 401 || err.response.status == 400) {
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
      } else {
        store.commit('setError', {
          code: err.response.status,
          header: 'Erreur interne',
          message: 'Veuillez réessayer plus tard.'
        })
      }
    })
  }
}
