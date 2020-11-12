import {Action} from "redux"

const graphState = {
  stringRepresentation: '0 AMO',
  percent: 0
}

const initialBlockState = {
  height: 1,
  chain_id: 'amo-cherryblossom-01',
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
  time: '2020-04-03T01:08:59.479Z',
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
  chainId: 'amo-cherryblossom-01',
  height: 1,
  updated: false,
  blockState: initialBlockState,
  recentTxs: [initialTransactions],
}

export type GraphState = typeof graphState

export type BlockchainInitialState = typeof initialState

export type BlockchainState = typeof initialBlockState

export type TransactionSchema = typeof initialTransactions

export const UPDATE_BLOCKCHAIN = 'UPDATE_BLOCKCHAIN'

export const UPDATE_RECENT_TXS = 'UPDATE_RECENT_TXS'

export const NEW_BLOCKCHAIN = 'NEW_BLOCKCHAIN'

export const NEW_RECENT_TXS = 'NEW_RECENT_TXS'

export const SET_NETWORK = 'SET_NETWORK'

export const newBlockchainState = (payload: BlockchainState) => ({
  type: NEW_BLOCKCHAIN,
  payload
})

export const newRecentTxs = (payload: TransactionSchema[]) => ({
  type: NEW_RECENT_TXS,
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

interface NewRecentTransactions extends Action {
  type: typeof NEW_RECENT_TXS,
  payload: TransactionSchema[]
}

export interface SetNetwork extends Action {
  type: typeof SET_NETWORK,
  payload: string
}

type actions =
  NewBlockchainStateAction |
  NewRecentTransactions |
  SetNetwork |
  Action<typeof UPDATE_BLOCKCHAIN> |
  Action<typeof UPDATE_RECENT_TXS>

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
    case NEW_RECENT_TXS:
      return {
        ...state,
        recentTxs: action.payload
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
