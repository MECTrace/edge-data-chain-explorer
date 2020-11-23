import React, {useCallback, useEffect, useMemo, useState} from 'react'
import ExplorerAPI from '../ExplorerAPI'
import InfiniteTable from "../component/InfiniteTable"
import SizeTitle, {LastOptions} from "../component/SizeTitle"
import StatCard from "../component/StatCard"
import moment from 'moment'
import {BlockInfo} from "../reducer/blocks"
import {Grid} from "@material-ui/core"
import {History, Timeline, TrendingUp, ViewModule} from "@material-ui/icons"
import {Link} from "react-router-dom"
import {useChainId, useHeight} from "../reducer"

const columns = [
  {
    key: 'height',
    label: 'Height',
    style: {width: 100, flexGrow: 1},
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
    label: 'Time',
    style: {width: 100, flexGrow: 5},
    format: (time: string, chainId: string) => {
      // TODO: display interval
      return (
        `${moment(time).format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
      )
    }
  },
  {
    key: 'proposer',
    label: 'Proposer',
    style: {width: 100, flexGrow: 10},
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
    label: "# of Txs",
    style: {width: 100, flexGrow: 1}
  }
]

const BlocksStatView = () => {
  const [blocksStat, setBlocksStat] = useState<BlockStat>({
    chain_id: 'amo-cherrryblossom-01',
    last_height: 1,
    num_txs: 0,
    avg_num_txs: 0,
    avg_blk_tx_bytes: 0,
    avg_interval: 0
  })
  const chainId = useChainId()

  const onSizeChange = useCallback((lastBlocks: number) => {
    ExplorerAPI
      .fetchBlocksStats(chainId, lastBlocks)
      .then(({data}) => {
        setBlocksStat(data)
      })
  }, [chainId])

  useEffect(() => {
    onSizeChange(100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId])

  const title = useMemo(() => {
    return (
      <SizeTitle
        target="Block"
        values={LastOptions}
        onSizeChange={onSizeChange}
      />
    )
  }, [onSizeChange])

  return (
    <>
      <StatCard
        title={title}
        size="large"
      >
        <Grid
          container
          spacing={2}
        >
          <StatCard
            icon={TrendingUp}
            title="Transaction per Second"
            color="#9179F2"
            suffix="txs / s"
          >
            {blocksStat.avg_num_txs > 0
              ? (blocksStat.avg_num_txs / blocksStat.avg_interval).toFixed(2)
              : 0}
          </StatCard>
          <StatCard
            icon={History}
            title="Average interval"
            suffix="s / blk"
            color="#FF6E4A"
          >
            {blocksStat.avg_interval.toFixed(2)}
          </StatCard>
          <StatCard
            icon={Timeline}
            title="Average # of txs"
            suffix="txs / blk"
            color="#62D96B"
          >
            {blocksStat.avg_num_txs.toFixed(2)}
          </StatCard>
          <StatCard
            icon={ViewModule}
            title="Average tx bytes"
            suffix="B / blk"
          >
            {blocksStat.avg_blk_tx_bytes}
          </StatCard>
        </Grid>
      </StatCard>
    </>
  )
}

const Blocks = () => {
  const chainId = useChainId()
  const lastHeight = useHeight()

  // first section

  // second section
  const [blocks, setBlocks] = useState<BlockInfo[]>([])
  const [hasMoreBlocks, setHasMoreBlocks] = useState<boolean>(false)

  useEffect(() => {
    setBlocks([])
    if (chainId && lastHeight) {
      setHasMoreBlocks(true)
    }
  }, [chainId, lastHeight])

  const fetchBlocks = async (from: number, num: number) => {
    if (chainId && hasMoreBlocks) {
      const {data} = await ExplorerAPI
        .fetchBlocks(chainId, lastHeight, from, num)
      if (data.length > 0) {
        setBlocks(blocks.concat(data))
      } else {
        setHasMoreBlocks(false)
      }
    }
  }

  return (
    <>
      <BlocksStatView/>
      <InfiniteTable
        rows={blocks}
        columns={columns}
        hasMore={hasMoreBlocks}
        loadMoreRows={fetchBlocks}
      />
    </>
  )
}

export default Blocks
