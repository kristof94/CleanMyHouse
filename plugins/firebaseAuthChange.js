import { Auth } from '~/plugins/firebase-client-init.js'

export default () => {
  //const { store } = context
  Auth.onAuthStateChanged(user => {
    if (user && user.phoneNumber) {
      /*const refOrder = Database.ref('users'+user) usersRef.child(postId + '/order')
      refOrder.on('child_changed', function (snapshot) {
        var changedPost = snapshot.val()
        console.log('The updated post title is ' + changedPost)
      })*/
    }
  })
}
