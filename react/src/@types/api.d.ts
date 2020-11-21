type Network = {
  chain_id: string,
}

type AccountInfo = {
  chain_id: string,
  address: string,
  balance: string,
  stake: string,
  val_addr: string,
  delegate: string,
  del_addr?: string,
  val_pubkey: string,
  val_power: string
}

type ValidatorAccount = {
  address: string,
  eff_stake: string,
  owner: string,
  power: string,
  pubkey: string,
  stake: string
}

type BlockStat = {
  chain_id: string,
  last_height: number,
  num_txs: number,
  avg_num_txs: number,
  avg_blk_tx_bytes: number,
  avg_interval: number
}

type TxStat = {
  chain_id: string,
  tx_height: number,
  num_txs: number,
  num_txs_valid: number,
  num_txs_invalid: number
  avg_fee: number,
  avg_tx_bytes: number,
  avg_binding_lag: number,
  max_binding_lag: number
}

type AssetStat = {
  chain_id: string,
  active_coins: string,
  stakes: string,
  delegates: string
}

type BlockchainStat = {
  block_stat: BlockStat
  tx_stat: TxStat
  asset_stat: AssetStat
  height: number,
  time: string,
  tx_height: number,
  tx_index: number
} & BlockStat
  & Pick<TxStat, 'num_txs_valid' | 'num_txs_invalid' | 'avg_binding_lag' | 'max_binding_lag'>
  & AssetStat

type ValidatorStat = {
  avg_blk_incentive: string,
  avg_eff_stake: number,
  total_eff_stakes: number
  num_validators: number
}

type NodeStat = {
  num_nodes: number,
}

type NodeInfo = {
  node_id: string,
  moniker: string,
  val_addr: string,
  latest_block_height: number,
  latest_block_time: string,
  catching_up: number,
  elapsed: number,
  timestamp: string,
  uptime: number,
}

type StorageStat = {
  num_storages: number,
}

type StorageInfo = {
  chain_id: string,
  storage_id: number,
  url: string,
  registration_fee: string,
  hosting_fee: string,
  owner: string,
  active: boolean,
}

type Incentive = {
  height: number,
  address?: string,
  amount: string,
}

type Penalty = {
  height: number,
  address?: string,
  amount: string,
}

// https://github.com/amolabs/docs/blob/master/protocol.md#top-level-data
interface DraftConfig {
  max_validators?: number
  weight_validator?: number
  weight_delegator?: number
  min_staking_unit?: string
  blk_reward?: string
  tx_reward?: string
  penalty_ratio_m?: number
  penalty_ratio_l?: number
  laziness_counter_window?: number
  laziness_threshold?: number
  block_binding_window?: number
  lockup_period?: number
  draft_open_count?: number
  draft_close_count?: number
  draft_apply_count?: number
  draft_deposit?: string
  draft_quorum_rate?: number
  draft_pass_rate?: number
  draft_refund_rate?: number
  upgrade_protocol_height?: number
  upgrade_protocol_version?: number
}

interface Draft {
  chain_id: string
  draft_id: number
  proposer: string
  config: DraftConfig
  desc: string
  open_count: number
  close_count: number
  apply_count: number
  deposit: string
  tally_approve: string
  tally_reject: string
  tally_deposit: string
}
