import React, {useEffect} from 'react'
import StatCard from "../component/StatCard"
import {AccountBalance, AccountBalanceWallet, History, Receipt, Timeline, ViewHeadline} from "@material-ui/icons"
import {useDispatch, useSelector} from "react-redux"
import {RootState} from "../reducer"
import {GraphState} from "../reducer/blockchain"
import LinearGraph from "../component/LinearGraph"
import CollapseTable from "../component/CollapseTable"
import {BlockInfo, FETCH_RECENT_BLOCKS} from "../reducer/blocks"
import moment from 'moment'
import {Link} from "react-router-dom"
import {Grid} from "@material-ui/core"

const columns = [
  {
    key: 'height',
    format: (height: number, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/block/${height}`}>
          {height}
        </Link>
      )
    }
  },
  {
    key: 'time',
    format: (s: string, chainId: string, rowData: BlockInfo) => {
      const diff = Math.abs(moment().diff(moment(s)))
      return `${diff < 60000 ? `${Math.floor(diff / 1000)} seconds ago` : moment(s).fromNow()} (+${rowData.interval.toFixed(3)} sec)`
    }
  },
  {
    key: 'proposer',
    format: (validator: string, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/validator/${validator}`}>
          <code>{validator}</code>
        </Link>
      )
    }
  },
  {
    key: 'num_txs',
    header: '# of TXs'
  },
]

const RecentBlocks = () => {
  const height = useSelector<RootState, number>(state => state.blockchain.blockState.height)
  const blocks = useSelector<RootState, BlockInfo[]>(state => state.blocks.blocks)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({type: FETCH_RECENT_BLOCKS})
  }, [height, dispatch])

  return (
    <CollapseTable<BlockInfo>
      dataSource={blocks}
      columns={columns}
      rowKey='height'
      fallbackText="Ready"
      loading={blocks.length === 0}
    />
  )
}

const ValidatorStatsTitle = [
  'Eff. Stake Total',
  'On-line',
  'Off-line'
]

const CoinsStatsTitles = [
  'Coin total',
  'Stakes',
  'Delegated stakes'
]

const CoinStats = () => {
  const coinsStats = useSelector<RootState, GraphState[]>(state => state.blockchain.blockState.coinsStats)

  return (
    <div>
      {
        coinsStats.map((v, i) => (
          <LinearGraph
            key={i}
            title={CoinsStatsTitles[i]}
            value={`${v.stringRepresentation} (${v.percent.toFixed(2)}%)`}
            percent={v.percent}
          />
        ))
      }
    </div>
  )
}

const ValidatorStats = () => {
  const validatorStats = useSelector<RootState, GraphState[]>(state => state.blockchain.blockState.validatorStats)

  return (
    <div>
      {
        validatorStats.map((v, i) => (
          <LinearGraph
            key={i}
            title={ValidatorStatsTitle[i]}
            value={`${v.stringRepresentation} (${v.percent.toFixed(2)}%)`}
            percent={v.percent}
          />
        ))
      }
    </div>
  )
}

const Dashboard = () => {
  const blockState = useSelector<RootState, any>(state => state.blockchain.blockState)

  return (
    <>
      <StatCard
        size="large"
        title="Block stats in last 1000 blocks"
      >
        <Grid
          container
          spacing={2}
        >
          <StatCard
            icon={ViewHeadline}
            title="Block height"
            size="small"
          >
            {blockState.height}
          </StatCard>
          <StatCard
            icon={History}
            title="Average interval"
            suffix='s'
            color='#FF6E4A'
            size="small"
          >
            {blockState.avg_interval.toFixed(2)}
          </StatCard>
          <StatCard
            icon={Timeline}
            title="Transaction per Second"
            suffix='txs / s'
            color='#62D96B'
            size="small"
          >
            {(blockState.avg_num_txs / blockState.avg_interval).toFixed(2)}
          </StatCard>
          <StatCard
            icon={Receipt}
            title="Transaction per Block"
            suffix='txs / blk'
            color='#FFC940'
            size="small"
          >
            {(blockState.avg_num_txs).toFixed(2)}
          </StatCard>
        </Grid>
      </StatCard>
      <StatCard
        icon={AccountBalance}
        title="Validators"
        size='medium'
        color='#634DBF'
      >
        <ValidatorStats/>
      </StatCard>
      <StatCard
        icon={AccountBalanceWallet}
        title="Coins and Stakes"
        size='medium'
        color='#F55656'
      >
        <CoinStats/>
      </StatCard>
      <RecentBlocks/>
    </>
  )
}

export default Dashboard
