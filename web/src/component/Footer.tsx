import React from 'react'
import {makeStyles, Theme} from "@material-ui/core/styles"
import {Link as Href} from "@material-ui/core"
import Icon from "@material-ui/core/Icon"

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    height: '100px',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
    padding: '30px 120px',
    backgroundColor: '#182026',
    alignItems: 'center',
    color: 'white',
    lineHeight: '30px',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      padding: '1rem 0'
    }
  },
  link: {
    lineHeight: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    margin: '0 10px'
  },
  icons: {
    display: 'flex',
    height: '30px',
    alignItems: 'center',
    color: '#E1E8ED',
  },
  logo: {
    fontSize: '0.9rem',
    color: '#E1E8ED'
  }
}))

const items = [
  {
    icon: () => <Icon className="fas fa-home"/>,
    url: 'https://amo.foundation'
  },
  {
    icon: () => <Icon className="fas fa-link"/>,
    url: 'https://testnet.amolabs.io'
  },
  {
    icon: () => <Icon className="fab fa-medium"/>,
    url: 'https://medium.com/amo-blockchain'
  },
  {
    icon: () => <Icon className="fab fa-facebook"/>,
    url: 'https://www.facebook.com/amoblockchain'
  }
]

const Footer = () => {
  const classes = useStyle()

  return (
    <div className={classes.root}>
      <div className={classes.icons}>
        {
          items.map((v) => (
            <div key={v.url} className={classes.link}>
              <Href href={v.url} color="inherit">
                <v.icon/>
              </Href>
            </div>
          ))
        }
      </div>
      <h3 className={classes.logo}>
        (C) 2020 AMO Labs Pte Ltd. All rights reserved.
      </h3>
    </div>
  )
}

export default Footer
