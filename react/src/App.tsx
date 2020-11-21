import React, {useEffect, useState} from "react"
import {
  AppBar,
  createMuiTheme,
  FormControl,
  Grid,
  Hidden,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery
} from "@material-ui/core"
import {makeStyles, ThemeProvider} from "@material-ui/core/styles"
import {useSelector, useDispatch} from "react-redux"
import {Search} from "@material-ui/icons"
import {Route, RouteProps, Switch} from "react-router-dom"
import {push, replace} from "connected-react-router"
import {RootState, useChainId, usePath, STORE_NETWORKS} from "./reducer"
import {setNetwork, UPDATE_BLOCKCHAIN} from "./reducer/blockchain"
import ExplorerAPI from "./ExplorerAPI"
import Dashboard from "./pages/Dashboard"
import Inspect from "./pages/Inspect"
import Transactions from "./pages/Transactions"
import Blocks from "./pages/Blocks"
import Validators from "./pages/Validators"
import Governance from "./pages/Governance"
import Storages from "./pages/Storages"
import Nodes from "./pages/Nodes"
import Footer from "./component/Footer"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  mr2: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 2,
  },
  searchForm: {
    flexDirection: 'row',
    flexGrow: 1
  }
}))

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: "#fafafa",
      dark: "#fafafa"
    }
  },
})

const routers: RouteProps[] = [
  {
    path: '/:chainId',
    exact: true,
    component: Dashboard
  },
  {
    path: '/:chainId/inspect',
    component: Inspect
  },
  {
    path: '/:chainId/blocks',
    component: Blocks
  },
  {
    path: '/:chainId/transactions',
    component: Transactions
  },
  {
    path: '/:chainId/validators',
    component: Validators
  },
  {
    path: '/:chainId/governance',
    component: Governance
  },
  {
    path: '/:chainId/storages',
    component: Storages
  },
  {
    path: '/:chainId/nodes',
    component: Nodes
  },
]

const pages = routers.map((r) => { const [, , page = ''] = (r.path as string).split('/'); return page})

const tabs = ['dashboard', ...pages.slice(1)]

const ExplorerBar = () => {
  const styles = useStyles()
  const [tab, setTab] = useState<number>(0)
  const [searchText, setSearchText] = useState('')
  const isDesktop = useMediaQuery('(min-width: 1280px)')

  const dispatch = useDispatch()
  const chainId = useChainId()
  const path = usePath()
  const networks = useSelector<RootState, string[]>(state => 
    state.main.networks
  )

  useEffect(() => {
    const [, , page = ''] = path.split("/")

    for (let i = 0; i < pages.length; i += 1) {
      if (pages[i] === page) {
        setTab(i)
        return
      }
    }
  }, [path])

  const onTabChange = (event: any, newTab: any) => {
    dispatch(push(`/${chainId}/${pages[newTab]}`))
    setTab(newTab)
  }

  const onNetworkChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>,) => {
    dispatch(push(`/${e.target.value}`))
  }

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value.trim())
  }

  const onSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      const length = searchText.length
      if (length === 40) {
        dispatch(push(`/${chainId}/inspect/account/${searchText}`))
      } else if (length === 64) {
        dispatch(push(`/${chainId}/inspect/tx/${searchText}`))
      } else {
        if(/^([0-9]+)$/.test(searchText)) {
          dispatch(push(`/${chainId}/inspect/block/${searchText}`))
        } else {
          dispatch(push(`/${chainId}/inspect/404`))
        }
      }
    }
  }

  return (
    <AppBar position="fixed">
      <Toolbar>
        <img src={require('./assets/amo_white.png')} alt="logo" style={{
          height: '30px',
          marginRight: '12px'
        }}/>
        <Hidden only={['xs', 'sm']}>
          <Typography variant={"h5"} className={styles.title}>
            AMO Blockchain Explorer
          </Typography>
        </Hidden>
        <ThemeProvider theme={darkTheme}>
          <FormControl className={styles.searchForm}>
            <InputLabel id="network-select-label">
              Network
            </InputLabel>
            <Select
              value={chainId}
              labelId="network-select-label"
              className={styles.mr2}
              onChange={onNetworkChange}
              style={{
                width: '40%'
              }}
            >
              {networks.map((v, i) => (
                <MenuItem value={v} key={i}>{v}</MenuItem>
              ))}
            </Select>
            <TextField
              value={searchText}
              onChange={onSearchChange}
              onKeyUp={onSearch}
              style={{
                width: '60%'
              }}
              placeholder={"Block height, Account, Transaction hash"}
              label="Search"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search/>
                  </InputAdornment>
                )
              }}
              disabled={chainId.length === 0}
            />
          </FormControl>
        </ThemeProvider>
      </Toolbar>
      <Tabs
        value={tab}
        onChange={onTabChange}
        aria-label="main tabs"
        variant={isDesktop ? 'standard' : 'scrollable'}
        scrollButtons="on"
        centered={isDesktop}
      >
        {tabs.map((t, i) => (
          <Tab
            key={i}
            label={t}
            disabled={chainId.length === 0}
          />
        ))}
      </Tabs>
    </AppBar>
  )
}

function App() {
  const dispatch = useDispatch()
  const chainId = useChainId()
  const path = usePath()
  const networks = useSelector<RootState, string[]>(state => 
    state.main.networks
  )

  useEffect(() => {
    ExplorerAPI.fetchNetworks()
    .then(({data}) => {
      const _networks = data.map(n => n.chain_id)
      dispatch({type: STORE_NETWORKS, payload: _networks})
    })
  }, [dispatch])

  useEffect(() => {
    const [, newChainId = '', page = ''] = path.split("/")

    if (!(networks.includes(newChainId))) {
      if (networks.length > 0) {
        dispatch(replace(`/${networks[0]}`))
      }
      return
    }

    if (chainId !== newChainId) {
      dispatch(setNetwork(newChainId))
    }

    if (!(pages.includes(page))) {
      // fall back to default tab
      dispatch(replace(`/${newChainId}/`))
    }

    const updateBlockchain = () => {
      if (newChainId === chainId || newChainId === '') {
        dispatch({type: UPDATE_BLOCKCHAIN})
      }
    }

    updateBlockchain()
    const handler = setInterval(() => {
      updateBlockchain()
    }, 3000)

    return () => clearInterval(handler)
  }, [dispatch, networks, path, chainId])

  return (
    <div>
      <ExplorerBar/>
      <div
        style={{
          marginTop: '124px'
        }}
      >
        <div
          style={{
            padding: '24px',
            display: 'flex',
            minHeight: 'calc(100vh - 254px)'
          }}
        >
          <Grid
            container
            justify="center"
          >
            <Grid
              item
              className="fixed-width"
            >
              <Grid
                container
                spacing={2}
              >
                <Switch>
                  {routers.map((r, i) => (
                    <Route key={i} {...r} />
                  ))}
                </Switch>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <Footer/>
      </div>
    </div>
  )
}

export default App
