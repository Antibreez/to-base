import $ from 'jquery'
import {Box, Button, Card, CardContent, Container, Stack, TextField, Typography, CircularProgress} from '@mui/material'
import {cloneElement, useEffect, useRef, useState} from 'react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import {delelteImages, setPost} from '../../services/firebase'
import {connect} from 'react-redux'
import {
  addPost,
  fetchImageFiles,
  fetchImages,
  replacePost,
  setCurrentImageFiles,
  setCurrentImages,
} from '../../redux/actions/post'
import {setImages} from '../../services/firebase'
import {useNavigate, useParams} from 'react-router-dom'
import {set} from 'firebase/database'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'

const findId = arr => {
  console.log('####arrr ', arr)
  const idx = Math.floor(Math.random() * 1000)

  return arr.findIndex(item => item.id === idx) === -1 ? idx : findId(arr)
}

let currentPost = {}

function AddPost(props) {
  const [allFiles, setAllFiles] = useState([])
  const [imgSrc, setImgSrc] = useState([])
  const [titleVal, setTitleVal] = useState('')
  const [textVal, setTextVal] = useState('')
  const [tagsVal, setTagsVal] = useState('')
  const [titleErr, setTitleErr] = useState(false)
  const [textErr, setTextErr] = useState(false)
  const [tagsErr, setTagsErr] = useState(false)
  const [isUploading, setUploading] = useState(false)
  const [fileNames, setFileNames] = useState([])

  const navigate = useNavigate()
  const params = useParams()

  function readmultifiles(e) {
    const files = e.target.files
    const promises = []

    function readFile(index) {
      console.log('changed')
      if (index >= files.length) return

      var file = files[index]

      var reader = new FileReader()

      const promise = new Promise(res => {
        reader.onloadstart = function (e) {}

        reader.onprogress = function (e) {}

        reader.onloadend = function (e) {
          res([file, reader.result])
        }

        reader.readAsDataURL(file)
      })

      promises.push(promise)

      readFile(index + 1)
    }

    readFile(0)

    Promise.all(promises).then(val => {
      let files = []
      let img = []

      val.forEach(item => {
        files.push(item[0])
        img.push(item[1])
      })

      setAllFiles(allFiles.concat(files))
      setImgSrc(imgSrc.concat(img))
    })
  }

  function onDelete(idx) {
    return () => {
      const newAllFiles = allFiles.filter((file, id) => {
        return id !== idx
      })
      const newImgSrc = imgSrc.filter((img, id) => {
        return id !== idx
      })

      setAllFiles(newAllFiles)
      setImgSrc(newImgSrc)
    }
  }

  function onTitleInput(e) {
    setTitleVal(e.target.value)
    setTitleErr(false)
  }

  function onTextInput(e) {
    setTextVal(e.target.value)
    setTextErr(false)
  }

  function onTagsInput(e) {
    setTagsVal(e.target.value)
    setTagsErr(false)
  }

  function submitHandler() {
    const isTitleValid = !!titleVal.trim()
    const isTextValid = !!textVal.trim()
    const isTagsValid = !!tagsVal.trim()

    setTitleErr(!isTitleValid)
    setTextErr(!isTextValid)
    setTagsErr(!isTagsValid)

    if (isTitleValid && isTextValid && isTagsValid) {
      setUploading(true)

      let updatedPost = {}
      let newPost = {}
      let newPosts = []
      let newId = null

      if (params.postId) {
        updatedPost = {
          id: parseInt(params.postId, 10),
          title: titleVal,
          text: textVal,
          tags: tagsVal.toLowerCase().split(' '),
        }

        newPosts = props.posts.map(post => {
          return post.id === updatedPost.id ? updatedPost : post
        })
      } else {
        newId = findId(props.posts)

        newPost = {
          id: newId,
          title: titleVal,
          text: textVal,
          tags: tagsVal.toLowerCase().split(' '),
        }

        newPosts = [...props.posts, newPost]
      }

      setPost(newPosts)
        .then(() => {
          !params.postId ? props.addPost(newPost) : props.replacePost(updatedPost)
          const id = parseInt(params.postId, 10) ? parseInt(params.postId, 10) : newId

          setImages(id, allFiles).then(() => {
            navigate(`/${id}`)
          })
        })
        .catch(e => console.log(e))
    }
  }

  useEffect(() => {
    if (params.postId) {
      currentPost = props.posts.find(post => post.id === parseInt(params.postId, 10))
      setTitleVal(currentPost.title)
      setTextVal(currentPost.text)
      setTagsVal(currentPost.tags.join(' '))

      props.fetchImages(parseInt(params.postId, 10))
      props.fetchImageFiles(parseInt(params.postId, 10))
    } else {
      props.setCurrentImages(null)
      props.setCurrentImageFiles(null)
    }
  }, [])

  useEffect(() => {
    !!props.currentImages ? setImgSrc(props.currentImages) : setImgSrc([])
  }, [props.currentImages])

  useEffect(() => {
    if (props.currentImageFiles && props.currentImageFiles.length > 0) {
      const files = props.currentImageFiles.map(file => {
        return file[0]
      })

      const names = props.currentImageFiles.map(file => {
        return file[1]
      })

      setAllFiles(files)
      setFileNames(names)
    } else {
      setAllFiles([])
    }
  }, [props.currentImageFiles])

  return (
    <Container sx={{py: 4}}>
      {props.isAdmin === false ? (
        <p>Для доступа к этой странице нужно иметь права администратора</p>
      ) : (
        <>
          <Typography variant="h5" align="center" gutterBottom>
            {!!params.postId && (
              <Box sx={{textAlign: 'left'}}>
                <Button
                  size="large"
                  onClick={() => {
                    navigate(`/${params.postId}`)
                  }}
                  sx={{mr: 'auto'}}
                >
                  <KeyboardBackspaceIcon />
                  <Typography variant="h6" sx={{px: 2}}>
                    Назад
                  </Typography>
                </Button>
              </Box>
            )}
            {params.postId ? 'Редактировать пост' : 'Добавить новый пост'}
          </Typography>
          <TextField
            error={titleErr}
            fullWidth
            required
            id="name"
            label="Название"
            margin="normal"
            value={titleVal}
            helperText={titleErr ? 'Поле не может быть пустым' : ''}
            onChange={onTitleInput}
          />
          <Typography sx={{mt: 3}}>
            Чтобы текст в посте отображался жирным начертанием, заключите его между символами "*"
            <br />
            Пример:
            <br />
            Это *выделенный* текст
            <br />
            Это <b>выделенный</b> текст
          </Typography>
          <TextField
            error={textErr}
            fullWidth
            required
            id="text"
            label="Текст"
            margin="normal"
            multiline
            minRows={5}
            value={textVal}
            helperText={textErr ? 'Поле не может быть пустым' : ''}
            onChange={onTextInput}
            sx={{mt: 1}}
          />
          <TextField
            error={tagsErr}
            fullWidth
            required
            id="outlined-required"
            label="Ключевые слова (через пробел)"
            margin="normal"
            multiline
            minRows={1}
            sx={{mb: 3}}
            value={tagsVal}
            helperText={tagsErr ? 'Введите хотя бы одно слово' : ''}
            onChange={onTagsInput}
          />
          <Box
            sx={{p: 2, mb: 3}}
            style={{border: '1px dashed #bbbbbb', borderRadius: '5px', backgroundColor: '#f7f7f7'}}
          >
            <Button
              variant="outlined"
              component="label"
              sx={{py: 3}}
              style={{display: 'block', textAlign: 'center', backgroundColor: '#ffffff'}}
            >
              Загрузить изабражения
              <input type="file" hidden onChange={readmultifiles} multiple />
            </Button>

            <Stack gap={2}>
              {imgSrc.map((img, idx) => {
                return (
                  <Card key={idx} sx={{mt: idx > 0 ? 0 : 2}} style={{backgroundColor: '#ffffff'}}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" gap={2}>
                        <Stack
                          justifyContent="center"
                          alignItems="center"
                          sx={{width: '100px', height: '60px'}}
                          style={{flexShrink: 0}}
                        >
                          <img style={{maxWidth: '100%', maxHeight: '100%'}} src={img} />
                        </Stack>
                        <Typography
                          variant="body1"
                          style={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}
                        >
                          {!!allFiles[idx] && !!allFiles[idx].name ? allFiles[idx].name : fileNames[idx]}
                        </Typography>
                        <Button style={{marginLeft: 'auto'}} onClick={onDelete(idx)}>
                          <DeleteForeverIcon />
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                )
              })}
            </Stack>
          </Box>

          <Button
            variant="contained"
            sx={{py: 3, mb: 3}}
            style={{display: 'block', textAlign: 'center', width: '100%'}}
            onClick={submitHandler}
          >
            {isUploading ? <CircularProgress style={{color: '#fff'}} /> : <span>Отправить</span>}
          </Button>
        </>
      )}
    </Container>
  )
}

function mapStateToProps(state) {
  return {
    posts: state.post.posts,
    currentImages: state.post.currentImages,
    currentImageFiles: state.post.currentImageFiles,
    user: state.auth.user,
    isAdmin: state.auth.isAdmin,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addPost: value => dispatch(addPost(value)),
    replacePost: value => dispatch(replacePost(value)),
    fetchImages: value => dispatch(fetchImages(value)),
    fetchImageFiles: value => dispatch(fetchImageFiles(value)),
    setCurrentImages: value => dispatch(setCurrentImages(value)),
    setCurrentImageFiles: value => dispatch(setCurrentImageFiles(value)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddPost)
