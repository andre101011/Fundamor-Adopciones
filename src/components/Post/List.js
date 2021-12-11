import React, { useEffect, useState, useContext } from 'react'
import {
  Button,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  CardMedia,
  Box,
} from '@mui/material'

import { makeStyles } from '@mui/styles'

import { FaTrashAlt, FaUserEdit } from 'react-icons/fa'

import './list.scss'
import PostContext from '../../context/post/postContext'

const useStyles = makeStyles({
  root: {
    maxWidth: 800,
    // width: 'clamp(350px, 50%, 1000px);',
    padding: 25,
    borderRadius: '4px',
    margin: '0.8rem',
  },
  media: {
    height: 200,
  },
  customBox: {
    // display: '-webkit-box',
    // boxOrient: 'vertical',
    // lineClamp: 2,
    // wordBreak: 'break-all',
    // overflow: 'hidden',
  },
})

export default function List() {
  const { posts, getPosts, removePost, selectPost, loading } = useContext(
    PostContext,
  )
  console.log(posts)
  const [itemRemove, setItemRemove] = useState(null)
  const selectPostRemove = (idPost) => setItemRemove(idPost)

  useEffect(() => {
    getPosts()
  }, [])

  useEffect(() => {
    setItemRemove(null)
  }, [posts])

  return (
    <>
      <div className="container">
        <Dialog
          open={itemRemove !== null}
          onClose={() => {
            setItemRemove(null)
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirmación</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Estás seguro que deseas eliminar esta publicación?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setItemRemove(null)
              }}
            >
              Cancelar
            </Button>
            <Button onClick={() => removePost(itemRemove)} autoFocus>
              SÍ
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Backdrop
        sx={{
          color: '#fff',
          flex: 1,
          justifyContent: 'center',
          flexDirection: 'column',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <p style={{ marginLeft: 5 }}>Cargando ...</p>
      </Backdrop>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {posts.map((element, index) => (
          <PostItem
            item={element}
            key={index}
            removePost={selectPostRemove}
            selectPost={selectPost}
          />
        ))}
      </div>
    </>
  )
}

const PostItem = ({ item, removePost, selectPost }) => {
  const classes = useStyles()
  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        // image="https://via.placeholder.com/300x100"
        image="/images/cat_3.jpg"
      />
      <CardContent>
        {/* <Typography sx={{ fontSize: 'h6.fontSize' }} gutterBottom>
          {item.titulo}
        </Typography> */}
        <Box component="div" classes={{ root: classes.customBox }}>
          {item.cuerpo}
        </Box>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          onClick={() => {
            selectPost(item)
          }}
        >
          <FaUserEdit size={30} cursor="pointer" />
        </IconButton>
        <IconButton
          aria-label="share"
          onClick={() => {
            removePost(item.id_publicacion)
          }}
        >
          <FaTrashAlt size={25} cursor="pointer" />
        </IconButton>
      </CardActions>
      <Typography
        sx={{ fontSize: 14, textAlign: 'right' }}
        color="text.secondary"
        gutterBottom
      >
        {item.fecha_creacion}
      </Typography>
    </Card>
  )
}
