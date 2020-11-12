import {combineReducers} from "redux"
import blockchain from './blockchain'
import blocks from "./blocks"
import {connectRouter} from 'connected-react-router'
import {History} from 'history'
import {shallowEqual, useSelector} from "react-redux"

const rootReducer = (history: History<History.LocationState>) => combineReducers({
  blockchain,
  blocks,
  router: connectRouter(history)
})

export default rootReducer

export type RootState = ReturnType<ReturnType<typeof rootReducer>>

type UpdateState = {
  updated: boolean,
  chainId: string,
}

export const useChainId = () => {
  return useSelector<RootState, string>(state => state.blockchain.chainId, shallowEqual)
}

export const useUpdateState = () => {
  return useSelector<RootState, UpdateState>(state => ({
    updated: state.blockchain.updated,
    chainId: state.blockchain.chainId,
  }), shallowEqual)
}
