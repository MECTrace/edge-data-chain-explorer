import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Block from "./Block"
import Transaction from "./Transaction"
import Account from "./Account"
import Validator from "./Validator"
import Storage from "./Storage"
import NotFound from "./NotFound"

const Inspect = () => {

  return (
    <Switch>
      <Route path="/:chainId/inspect/block/:height" component={Block}/>
      <Route path="/:chainId/inspect/tx/:hash" component={Transaction}/>
      <Route path="/:chainId/inspect/account/:address" component={Account}/>
      <Route path="/:chainId/inspect/validator/:address" component={Validator}/>
      <Route path="/:chainId/inspect/storage/:storage_id" component={Storage}/>
      <Route path="/:chainId/inspect/404" component={NotFound}/>
    </Switch>
  )
}

export default Inspect
