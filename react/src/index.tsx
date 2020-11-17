import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'
import {Provider} from "react-redux"
import {applyMiddleware, compose, createStore} from "redux"
import reducer from './reducer'
import {composeWithDevTools} from "redux-devtools-extension"
import createSagaMiddleware from 'redux-saga'
import {createMuiTheme, CssBaseline, ThemeProvider} from "@material-ui/core"
import {syncBlockchain, syncRecentBlocks} from "./sagas"
import {createBrowserHistory} from 'history'
import {ConnectedRouter, routerMiddleware} from "connected-react-router"

export const history = createBrowserHistory()

const store = (() => {
  const sagaMiddleware = createSagaMiddleware()


  const middleware = [
    sagaMiddleware,
    routerMiddleware(history)
  ]

  const enhancer = process.env.NODE_ENV === 'production' ?
    compose(applyMiddleware(...middleware)) :
    composeWithDevTools({trace: true, traceLimit: 100})(
      applyMiddleware(...middleware)
    )

  const store = createStore(reducer(history), enhancer)

  sagaMiddleware.run(
    syncRecentBlocks
  )

  sagaMiddleware.run(
    syncBlockchain,
  )

  return store
})()

const darkTheme = createMuiTheme({
  palette: {
    type: 'light'
  }
})

ReactDOM.render(
  <React.Fragment>
    <Provider store={store}>
      <CssBaseline/>
      <ThemeProvider theme={darkTheme}>
        <ConnectedRouter history={history}>
          <App/>
        </ConnectedRouter>
      </ThemeProvider>
    </Provider>
  </React.Fragment>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
