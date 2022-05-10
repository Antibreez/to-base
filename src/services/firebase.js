import {initializeApp} from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth'
//import {getAnalytics} from 'firebase/analytics'
import {getDatabase, ref as dbRef, onValue, set} from 'firebase/database'

import {
  deleteObject,
  getBlob,
  getBytes,
  getDownloadURL,
  getMetadata,
  getStorage,
  listAll,
  ref as sRef,
  uploadBytes,
} from 'firebase/storage'

const ERROR_MESSAGES = {
  'email-already-in-use': 'Пользователь с таким Email уже существует',
  'user-not-found': 'Этот Email не зарегистрирован',
}

const firebaseConfig = {
  apiKey: 'AIzaSyCVZF-dIHuogf049h_05mKdUM5_IbzGi00',
  authDomain: 'smart-base-a4a10.firebaseapp.com',
  databaseURL: 'https://smart-base-a4a10-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'smart-base-a4a10',
  storageBucket: 'smart-base-a4a10.appspot.com',
  messagingSenderId: '292406807796',
  appId: '1:292406807796:web:b49a3ab9ce2fee173b22a1',
  measurementId: 'G-2KRE2ZZVPB',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

//const analytics = getAnalytics(app)
const db = getDatabase(app)
const storage = getStorage(app)
// export const getPost = () => {
//   const postRef = ref(db, "/1");

//   onValue(postRef, (snapshot) => {
//     console.log(snapshot.val());
//   });
// };

// export const getPostsRef = () => {
//   return dbRef(db, '/posts')
// }

export const getPosts = new Promise((res, rej) => {
  onValue(dbRef(db, '/posts'), snapshot => {
    res(snapshot.val())
  })
})

export const setPost = data => {
  return set(dbRef(db, `/posts`), data)
}

export const setUserData = (id, data) => {
  return set(dbRef(db, `/users/${id}`), data)
}

export const getUserStatus = id => {
  return new Promise((res, rej) => {
    onValue(dbRef(db, `/users/${id}`), snapshot => {
      res(snapshot.val())
    })
  })
}

export const getImages = id => {
  return new Promise((result, rej) => {
    let imagesUrl
    const promises = []

    listAll(sRef(storage, `images/${id}`)).then(res => {
      res.items.forEach((itemRef, idx) => {
        const p = new Promise(res1 => {
          getDownloadURL(itemRef).then(url => {
            res1(url)
          })
        })

        promises.push(p)
      })

      Promise.all(promises).then(values => result(values))
    })
  })
}

export const getImageFiles = id => {
  return new Promise((result, rej) => {
    const promises = []

    listAll(sRef(storage, `images/${id}`)).then(res => {
      res.items.forEach((itemRef, idx) => {
        const p = new Promise(res1 => {
          getBlob(itemRef).then(file => {
            getMetadata(itemRef).then(data => {
              res1([file, data.name])
            })
          })
        })

        promises.push(p)
      })

      Promise.all(promises).then(values => result(values))
    })
  })
}

export const delelteImages = id => {
  return new Promise((result, rej) => {
    const promises = []

    listAll(sRef(storage, `images/${id}`))
      .then(res => {
        if (res.items.length > 0) {
          res.items.forEach((itemRef, idx) => {
            const p = new Promise(res1 => {
              deleteObject(itemRef).then(() => {
                res1()
              })
            })
            promises.push(p)
          })

          Promise.all(promises).then(() => result())
        } else {
          result()
        }
      })
      .catch(e => console.log(e))
  })
}

export const setImages = (id, files) => {
  return new Promise((result, rej) => {
    delelteImages(id).then(() => {
      const promises = []

      files.forEach((file, idx) => {
        const promise = new Promise(res => {
          uploadBytes(sRef(storage, `images/${id}/${idx + 1}`), file).then(snapshot => {
            res()
          })
        })

        promises.push(promise)
      })

      Promise.all(promises).then(() => result())
    })
  })
}

export const createUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const signInUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = () => signOut(auth)

export const onAuthChanged = () => {
  return new Promise((res, rej) => {
    onAuthStateChanged(auth, user => {
      res(user)
    })
  })
}

export const sendConfirmEmail = () => {
  return sendEmailVerification(auth.currentUser)
}

export const getCurrentUser = () => {
  return auth.currentUser
}

export const getErrorMessage = serverMessage => {
  let result = 'Произошла ошибка'

  Object.keys(ERROR_MESSAGES).forEach(msg => {
    if (serverMessage.includes(msg)) result = ERROR_MESSAGES[msg]
  })

  return result
}
