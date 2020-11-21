import Axios, {AxiosResponse} from "axios"
import {BlockInfo} from "./reducer/blocks"
import {TransactionSchema} from "./reducer/blockchain"

const defaultURL = "https://explorer.amolabs.io/api"

const client = Axios.create({
  baseURL: defaultURL
})

type Result<T> = Promise<AxiosResponse<T>>

const fetchNetworks = (): Result<Network[]> => {
  return client
    .get(`/networks`)
}

const fetchBlocks = (chainId: string, anchor: number, from: number, size: number = 20): Result<BlockInfo[]> => {
  return client
    .get(`/chain/${chainId}/blocks?anchor=${anchor}&from=${from}&num=${size}`)
}

const fetchBlocksStats = (chainId: string, blocks: number = 100): Result<BlockStat> => {
  return client
    .get(`/chain/${chainId}/blocks?stat&num_blks=${blocks}`)
}

const fetchTransactions = (chainId: string, top: number, from: number, size: number = 20): Result<TransactionSchema[]> => {
  return client
    .get(`/chain/${chainId}/txs?top=${top}&from=${from}&num=${size}`)
}

const fetchBlock = (chainId: string, height: number): Result<BlockInfo> => {
  return client
    .get(`/chain/${chainId}/blocks/${height}`)
}

const fetchBlockTransactions = (chainId: string, height: number, from: number, size: number = 20): Result<TransactionSchema[]> => {
  return client
    .get(`/chain/${chainId}/blocks/${height}/txs?from=${from}&num=${size}`)
}

const fetchTransaction = (chainId: string, hash: string): Result<TransactionSchema[]> => {
  return client
    .get(`/chain/${chainId}/txs/${hash}`)
}

const fetchValidatorStat = (chainId: string): Result<ValidatorStat> => {
  return client
    .get(`/chain/${chainId}/validators?stat`)
}


const fetchValidators = (chainId: string, from: number, size: number = 20): Result<ValidatorAccount[]> => {
  return client
    .get(`/chain/${chainId}/validators?from=${from}&num=${size}`)
}

export type DelegateItem = {
  address: string,
  delegate: string
}

const fetchDelegators = (chainId: string, address: string, from: number, size: number = 20): Result<DelegateItem[]> => {
  return client
    .get(`/chain/${chainId}/validators/${address}/delegators`)
}

const fetchAccount = (chainId: string, address: string): Result<AccountInfo> => {
  return client
    .get(`/chain/${chainId}/accounts/${address}`)
}

const fetchAccountTransactions = (chainId: string, address: string, top: number, from: number, size: number = 20): Result<TransactionSchema[]> => {
  return client
    .get(`/chain/${chainId}/accounts/${address}/txs?top=${top}&from=${from}&num=${size}`)
}

const fetchValidatorAccount = (chainId: string, address: string): Result<ValidatorAccount> => {
  return client
    .get(`/chain/${chainId}/validators/${address}`)
}

const fetchTxStat = (chainId: string, txs: number = 100): Result<TxStat> => {
  return client
    .get(`/chain/${chainId}/txs?stat&num_txs=${txs}`)
}

const fetchBlockchain = (chainId: string, blocks: number = 1000, txs: number = 1000): Result<BlockchainStat> => {
  return client
    .get(`/chain/${chainId}?num_blks=${blocks}&num_txs=${txs}`)
}

const fetchDrafts = (chainId: string, from: number, size: number = 20): Result<Draft[]> => {
  return client
    .get(`/chain/${chainId}/drafts`)
}

const fetchDraft = (chainId: string, draftId: number): Result<Draft> => {
  return client
    .get(`/chain/${chainId}/drafts/${draftId}`)
}

const fetchStorageStat = (chainId: string): Result<StorageStat> => {
  return client.get(`chain/${chainId}/storages?stat`)
}

const fetchStorages = (chainId: string): Result<StorageInfo[]> => {
  return client
    .get(`chain/${chainId}/storages`)
}

const fetchStorage = (chainId: string, storageId: number): Result<StorageInfo> => {
  return client
    .get(`chain/${chainId}/storages/${storageId}`)
}

const fetchAccountIncentives = (
  chainId: string, address: string, top: number, from: number, num: number):
    Result<Incentive[]> => {
  return client
    .get(`chain/${chainId}/incentives/${address}?top=${top}&from=${from}&num=${num}`)
}

const fetchAccountPenalties = (
  chainId: string, address: string, top: number, from: number, num: number):
    Result<Penalty[]> => {
  return client
    .get(`chain/${chainId}/penalties/${address}?from=${from}&num=${num}`)
}

const fetchNodeStat = (chainId: string): Result<NodeStat> => {
  return client.get(`chain/${chainId}/nodes?stat`)
}

const fetchNodes = (chainId: string, range: number = 3600, from: number = 0, num: number = 20): Result<NodeInfo[]> => {
  return client
    .get(`/chain/${chainId}/nodes?range=${range}&from=${from}&num=${num}`)
}

export default {
  fetchNetworks,
  fetchBlocks,
  fetchBlocksStats,
  fetchTransactions,
  fetchBlock,
  fetchBlockTransactions,
  fetchTransaction,
  fetchValidatorStat,
  fetchValidators,
  fetchAccount,
  fetchAccountTransactions,
  fetchValidatorAccount,
  fetchBlockchain,
  fetchTxStat,
  fetchDelegators,
  fetchDrafts,
  fetchDraft,
  fetchStorageStat,
  fetchStorages,
  fetchStorage,
  fetchAccountIncentives,
  fetchAccountPenalties,
  fetchNodeStat,
  fetchNodes,
}
