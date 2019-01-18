import VuexPersistence from 'vuex-persist'

export default context => {
  const { store } = context
  const cookies = store.$cookies
  window.onNuxtReady(() => {
    new VuexPersistence({
      storage: {
        getItem: key => cookies.get(key),
        setItem: (key, value, opt) => cookies.set(key, value, opt),
        removeItem: key => cookies.remove(key),
        clear: () => cookies.removeAll()
      },
      modules: ['Order']
    }).plugin(store)
  })
}
