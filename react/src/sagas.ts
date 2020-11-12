import Axios, {AxiosRequestConfig} from "axios"
import {put, select, takeEvery} from 'redux-saga/effects'
import {newBlockchainState, newRecentTxs, UPDATE_BLOCKCHAIN, UPDATE_RECENT_TXS} from "./reducer/blockchain"
import {AMO} from "./util"
import {newBlocksAction, UPDATE_BLOCKS} from "./reducer/blocks"
import ExplorerAPI from "./ExplorerAPI"

const server = 'http://explorer.amolabs.io/api'

const option: AxiosRequestConfig = {
  headers: {
    'Cache-Control': 'no-cache'
  }
}

const fetchBlockchain = function* () {
  try {
    const chainId = yield select(state => state.blockchain.chainId)
    const {data} = yield ExplorerAPI.fetchBlockchain(chainId)

    const stakes = Number(data.stakes)
    const delegates = Number(data.delegates)
    const totalCoins = Number(data.active_coins) + stakes + delegates

    const effStakes = stakes + delegates
    const stakeOnline = stakes + delegates
    const stakeOffline = 0

    yield put(newBlockchainState({
      ...data,
      coinsStats: [
        {
          stringRepresentation: AMO(totalCoins),
          percent: 100
        },
        {
          stringRepresentation: AMO(stakes),
          percent: stakes / totalCoins * 100
        },
        {
          stringRepresentation: AMO(delegates),
          percent: delegates / totalCoins * 100
        }
      ],
      validatorStats: [
        {
          stringRepresentation: AMO(effStakes),
          percent: 100
        },
        {
          stringRepresentation: AMO(stakeOnline),
          percent: 100
        },
        {
          stringRepresentation: AMO(stakeOffline),
          percent: 0
        }
      ]
    }))
  } catch (e) {

  }
}

const fetchRecentTransactions = function* () {
  try {
    const chainId = yield select(state => state.blockchain.chainId)
    const {data} = yield Axios.get(`${server}/chain/${chainId}/txs?top=0&from=0&num=15`, option)
    yield put(newRecentTxs(data))
  } catch (e) {

  }
}

const fetchRecentBlocks = function* () {
  try {
    const {chainId, height} = yield select(state => state.blockchain)
    const {blocks, currentHeight} = yield select(state => state.blocks)

    if (height === currentHeight || height < 11) {
      return
    }

    const fetchLength = Math.min(10, height - currentHeight)

    const newBlocks = []

    for (let i = 0; i < fetchLength; i++) {
      const {data: block} = yield ExplorerAPI.fetchBlock(chainId, height - i)
      newBlocks.push(block)
    }

    yield put(newBlocksAction({
      blocks: [
        ...newBlocks,
        ...blocks.slice(0, 10 - fetchLength)
      ],
      currentHeight: height
    }))
  } catch (e) {

  }
}

export function* syncBlockchain() {
  yield takeEvery(UPDATE_BLOCKCHAIN, fetchBlockchain)
}

export function* syncRecentTxs() {
  yield takeEvery(UPDATE_RECENT_TXS, fetchRecentTransactions)
}

export function* syncRecentBlocks() {
  yield takeEvery(UPDATE_BLOCKS, fetchRecentBlocks)
}
