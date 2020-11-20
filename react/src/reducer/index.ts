import {combineReducers} from "redux"
import blockchain from './blockchain'
import blocks from "./blocks"
import {connectRouter} from 'connected-react-router'
import {History} from 'history'
import {shallowEqual, useSelector} from "react-redux"

// TODO: make separate reducer
export const STORE_NETWORKS = 'STORE_NETWORKS'
const initialStateMain = {
  networks: []
}
export type StateMain = typeof initialStateMain

const rootReducer = (history: History<History.LocationState>) => combineReducers({
  main: (state: StateMain = initialStateMain, action) => {
    switch (action.type) {
      case STORE_NETWORKS:
        return {...state, networks: action.payload}
      default:
        return state
    }
  },
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

export const useHeight = () => {
  return useSelector<RootState, number>(state => state.blockchain.height, shallowEqual)
}

export const usePath = () => {
  return useSelector<RootState, string>((state: RootState) => state.router.location.pathname)
}

export const useUpdateState = () => {
  return useSelector<RootState, UpdateState>(state => ({
    updated: state.blockchain.updated,
    chainId: state.blockchain.chainId,
  }), shallowEqual)
}
