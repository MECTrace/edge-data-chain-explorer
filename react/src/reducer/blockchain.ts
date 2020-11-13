import {Action} from "redux"

const graphState = {
  stringRepresentation: '0 AMO',
  percent: 0
}

const initialBlockState = {
  height: 0,
  chain_id: '',
  num_blocks: 0,
  num_txs: 0,
  avg_interval: 0,
  num_txs_valid: 0,
  num_txs_invalid: 0,
  avg_binding_lag: 0.0,
  max_binding_lag: 0,
  avg_num_txs: 0,
  active_coins: '0',
  stakes: '0',
  delegates: '0',
  time: '',
  tx_height: 0,
  tx_index: 0,
  coinsStats: [graphState, graphState, graphState],
  validatorStats: [graphState, graphState, graphState]
}

export const initialTransactions = {
  chain_id: '',
  height: 0,
  index: 0,
  hash: '',
  code: 0,
  info: '',
  type: 'unknown',
  sender: '',
  fee: 0,
  payload: "{}",
  last_height: 0,
}

const initialState = {
  chainId: '',
  height: 0,
  updated: false,
  blockState: initialBlockState,
  recentTxs: [initialTransactions],
}

export type GraphState = typeof graphState

export type BlockchainInitialState = typeof initialState

export type BlockchainState = typeof initialBlockState

export type TransactionSchema = typeof initialTransactions

export const UPDATE_BLOCKCHAIN = 'UPDATE_BLOCKCHAIN'

export const NEW_BLOCKCHAIN = 'NEW_BLOCKCHAIN'

export const SET_NETWORK = 'SET_NETWORK'

export const newBlockchainState = (payload: BlockchainState) => ({
  type: NEW_BLOCKCHAIN,
  payload
})

export const setNetwork = (payload: string) => ({
  type: SET_NETWORK,
  payload
})

interface NewBlockchainStateAction extends Action {
  type: typeof NEW_BLOCKCHAIN,
  payload: BlockchainState
}

export interface SetNetwork extends Action {
  type: typeof SET_NETWORK,
  payload: string
}

type actions =
  NewBlockchainStateAction |
  SetNetwork |
  Action<typeof UPDATE_BLOCKCHAIN>

export default (state: BlockchainInitialState = initialState, action: actions) => {
  switch (action.type) {
    case NEW_BLOCKCHAIN:
      if (action.payload.chain_id !== state.chainId) {
        return state
      }

      return {
        ...state,
        blockState: action.payload,
        height: action.payload.height,
        updated: true
      }
    case SET_NETWORK:
      return {
        ...state,
        chainId: action.payload,
        height: 1,
        updated: false
      }
    default:
      return state
  }
}
