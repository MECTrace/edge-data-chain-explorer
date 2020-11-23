import {put, select, takeEvery} from 'redux-saga/effects'
import {newBlockchainState, UPDATE_BLOCKCHAIN} from "./reducer/blockchain"
import {displayAMO} from "./util"
import {newBlocksAction, FETCH_RECENT_BLOCKS} from "./reducer/blocks"
import ExplorerAPI from "./ExplorerAPI"

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
          stringRepresentation: displayAMO(totalCoins),
          percent: 100
        },
        {
          stringRepresentation: displayAMO(stakes),
          percent: stakes / totalCoins * 100
        },
        {
          stringRepresentation: displayAMO(delegates),
          percent: delegates / totalCoins * 100
        }
      ],
      validatorStats: [
        {
          stringRepresentation: displayAMO(effStakes),
          percent: 100
        },
        {
          stringRepresentation: displayAMO(stakeOnline),
          percent: 100
        },
        {
          stringRepresentation: displayAMO(stakeOffline),
          percent: 0
        }
      ]
    }))
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

export function* syncRecentBlocks() {
  yield takeEvery(FETCH_RECENT_BLOCKS, fetchRecentBlocks)
}
