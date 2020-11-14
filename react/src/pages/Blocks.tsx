import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {BlockInfo} from "../reducer/blocks"
import {useChainId} from "../reducer"
import {Grid} from "@material-ui/core"
import InfinityTable from "../component/InfinityTable"
import ExplorerAPI from '../ExplorerAPI'
import {Link} from "react-router-dom"
import StatCard from "../component/StatCard"
import {History, Timeline, TrendingUp, ViewModule} from "@material-ui/icons"
import SizeTitle, {LastOptions} from "../component/SizeTitle"
import useScrollUpdate from "../hooks/useScrollUpdate"
import moment from 'moment'

const columns = [
  {
    key: 'height',
    label: 'Height',
    width: 100,
    flexGrow: 1,
    columnData: {
      format: (height: number, chainId: string) => {
        return (
          <Link to={`/${chainId}/inspect/block/${height}`}>
            {height}
          </Link>
        )
      }
    }
  },
  {
    key: 'time',
    label: 'Time',
    width: 100,
    flexGrow: 5,
    columnData: {
      format: (time: string, chainId: string, data: BlockInfo) => {
        return (
          `${moment(time).format("YYYY-MM-DD HH:mm:ss.SSS ZZ")} (+${data.interval.toFixed(3)} sec)`
        )
      }
    }
  },
  {
    key: 'proposer',
    label: 'Proposer',
    width: 100,
    flexGrow: 10,
    columnData: {
      format: (validator: string, chainId: string) => {
        return (
          <Link to={`/${chainId}/inspect/validator/${validator}`}>
            <code>{validator}</code>
          </Link>
        )
      }
    }
  },
  {
    key: 'num_txs',
    label: "# of Txs",
    width: 100,
    flexGrow: 1
  }
]

type BlocksStatProps = {
  setRef: (instance?: HTMLDivElement) => void
}

const BlocksStatView = (props: BlocksStatProps) => {
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
        setRef={props.setRef}
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
  const [ref, setRef] = useState<HTMLDivElement | undefined>(undefined)

  const fetchBlocks = useCallback(async (size: number, fixedHeight: number, chainId: string) => {
    if (fixedHeight !== -1) {
      const nextHeight = fixedHeight - size

      if (nextHeight <= 0) {
        return []
      }

      const {data} = await ExplorerAPI.fetchBlocks(chainId, nextHeight)
      return data
    }

    return null
  }, [])
  const [blocks, loading, onScroll] = useScrollUpdate<BlockInfo>(fetchBlocks, ref)

  return (
    <>
      <BlocksStatView
        setRef={setRef}
      />
      <InfinityTable<BlockInfo>
        onScroll={onScroll}
        columns={columns}
        rowKey={'hash'}
        data={blocks}
        loading={loading}
      />
    </>
  )
}

export default Blocks
