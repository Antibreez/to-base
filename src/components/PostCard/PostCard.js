import {CardContent, Typography, CardActions, Card, Button, Box, CardActionArea} from '@mui/material'
import {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {useSearchParams, useNavigate} from 'react-router-dom'

const bull = (
  <Box component="span" sx={{display: 'inline-block', mx: '4px', transform: 'scale(1.5)'}}>
    •
  </Box>
)

function markTag(tags, currentTag) {
  let found = false
  let result = currentTag

  tags.forEach(tag => {
    if (found) return
    const newCurrentTag = currentTag.toLowerCase()
    const newTag = tag.toLowerCase()

    const splitted = newCurrentTag.toString().split(newTag)

    if (splitted.length > 1) {
      result = splitted.map((item, idx) => {
        return (
          <span key={idx}>
            {item}
            {idx < splitted.length - 1 ? <b>{newTag}</b> : null}
          </span>
        )
      })

      found = true
    }
  })

  return result
}

function PostCard(props) {
  const {id, title, text, tags, resultTags} = props
  const [userTags, setUserTags] = useState(resultTags)
  let [searchParams, setSearchParams] = useSearchParams()
  let navigate = useNavigate()

  useEffect(() => {
    setUserTags(resultTags)
  }, [resultTags])

  function clickHandler(e) {
    navigate(`/${id}`)
  }

  return (
    <Card sx={{minWidth: 275}}>
      <CardActionArea onClick={clickHandler}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {title}
          </Typography>
          <Typography
            variant="body1"
            style={{maxWidth: '100%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}
            gutterBottom
          >
            {text.split('*').join('')}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{p: 1}}
            style={{backgroundColor: '#efefef', borderRadius: '5px'}}
          >
            {tags.map((tag, idx) => {
              return idx < tags.length - 1 ? (
                <span key={idx}>
                  {markTag(userTags, tag)}
                  {bull}
                </span>
              ) : (
                <span key={idx}>{markTag(userTags, tag)}</span>
              )
            })}
            {/* <b>para</b>graph{bull}nev{bull}o{bull}lent{bull}lent{bull}lent{bull}lent{bull}lent{bull}lent{bull}lent{bull}
            lent{bull}lent{bull}lent */}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default PostCard
