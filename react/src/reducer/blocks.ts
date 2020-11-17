import {Action} from "redux"
import {SET_NETWORK, SetNetwork} from "./blockchain"

export const initialBlock = {
  chain_id: '',
  height: 0,
  time: '',
  hash: '',
  num_txs: 0,
  interval: 0,
  proposer: '',
  tx_bytes: 0,
  num_txs_valid: 0,
  num_txs_invalid: 0,
  incentives: "[]",
  validator_updates: "[]"
}

const initialState: {
  currentHeight: number,
  blocks: BlockInfo[]
} = {
  currentHeight: 1,
  blocks: []
}

export type BlocksInitialState = typeof initialState

export type BlockInfo = typeof initialBlock

export const FETCH_RECENT_BLOCKS = 'FETCH_RECENT_BLOCKS'

export const NEW_BLOCKS = 'NEW_BLOCKS'

export const newBlocksAction = (payload: {
  blocks: BlockInfo[],
  currentHeight: number
}) => ({
  type: NEW_BLOCKS,
  payload
})

interface NewRecentBlocks extends Action {
  type: typeof NEW_BLOCKS,
  payload: {
    blocks: BlockInfo[]
    currentHeight: number
  }
}

type actions =
  NewRecentBlocks |
  SetNetwork |
  Action<typeof FETCH_RECENT_BLOCKS>

export default (state: BlocksInitialState = initialState, action: actions) => {
  switch (action.type) {
    case SET_NETWORK:
      return {
        ...initialState
      }
    case NEW_BLOCKS:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
