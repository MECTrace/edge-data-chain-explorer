import React from 'react'
import {Grid} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import {Warning} from "@material-ui/icons"

const useStyles = makeStyles((theme) => ({
  root: {
    height: '600px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  icon: {
    fontSize: '8rem',
    color: theme.palette.warning.main
  }
}))

const message = (errorType: string, searchText: string) => {
  switch (errorType) {
    case 'BLOCK':
      return (
        <h2>
          Block #{searchText}
        </h2>
      )
    case 'ACCOUNT':
      return (
        <h2>
          Account #{searchText}
        </h2>
      )
    case 'TRANSACTION':
      return (
        <h2>
          Transaction #{searchText}
        </h2>
      )
    default:
      return ``
  }
}

const NotFound = () => {
  const state = window.history.state.state
  const classes = useStyles()

  const errorType = state?.type || 'NONE'
  const searchText = state?.search || ''

  return (
    <Grid
      item
      lg={12}
    >
      <div
        className={classes.root}
      >
        <Warning className={classes.icon}/>
        <h1>404 Not found</h1>
        {message(errorType, searchText)}
      </div>
    </Grid>
  )
}

export default NotFound
