export default function({ $axios /*, redirect*/ }) {
  // The server-side needs a full url to works

  if (process.env.NODE_ENV !== 'production') {
    $axios.onRequest(config => {
      console.log('Making request to ' + config.url)
    })
  }

  /*
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
  })*/

  if (!$axios.defaults.headers.common['XSRF-TOKEN']) {
    $axios.get('/api/getcsrftoken').then(response => {
      $axios.defaults.headers.common['XSRF-TOKEN'] = response.data.csrfToken
      $axios.setHeader('XSRF-TOKEN', response.data.csrfToken)
    })
  }
}
