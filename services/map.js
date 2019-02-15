var taskArray = [[1, 'Ménage'], [2, 'Repassage'], [3, 'Ménage et Repassage']]
var errorArray = [
  [
    'auth/wrong-password',
    {
      header: "Erreur d'identifiants.",
      message: 'Mot de passe incorrect.'
    }
  ],
  [
    'auth/user-not-found',
    {
      header: "Erreur d'identifiants.",
      message: 'Email inconnu, veuillez-vous inscrire.'
    }
  ],
  [
    'auth/email-already-in-use',
    {
      header: "Erreur d'identifiants.",
      message: 'Cet email est déjà utilisé par un autre utilisateur.'
    }
  ],
  [
    'auth/credential-already-in-use',
    {
      header: "Erreur d'identifiants.",
      message:
        'Ce numéro de téléphone est déjà utilisé par un autre utilisateur.'
    }
  ],
  [
    'auth/invalid-verification-code',
    {
      header: "Erreur d'identifiants.",
      message: 'Code incorrecte.'
    }
  ],
  [
    'auth/too-many-requests',
    {
      header: "Erreur d'identifiants.",
      message:
        'Opération bloquée due à une activité inhabituelle. Veuillez réessayer plus tard.'
    }
  ]
]

export const taskMap = new Map(taskArray)
export const errorMap = new Map(errorArray)
