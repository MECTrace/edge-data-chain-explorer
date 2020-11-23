import React, {useEffect, useState} from 'react'
import {useChainId} from "../reducer"
import ExplorerAPI from "../ExplorerAPI"
import {AxiosError} from "axios"

import {Link} from "react-router-dom"
import {Grid} from "@material-ui/core"
import {ThumbsUpDown, ThumbUpAlt, Timer} from "@material-ui/icons"
import StatCard from "../component/StatCard"
import InfiniteTable from "../component/InfiniteTable"
import {displayAddress, displayAMO} from "../util"

const draftListColumn = [
  {
    key: 'draft_id',
    label: 'ID',
    width: 100,
    format: (id: number, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/draft/${id}`}>
          {id}
        </Link>
      )
    }
  },
  {
    key: 'proposer',
    label: 'Proposer',
    style: {flexGrow: 8},
    width: 100,
    format: displayAddress,
  },
  {
    key: 'proposed_at',
    label: 'Proposed',
    width: 100,
    format: (height: number, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/block/${height}`}>
          {height}
        </Link>
      )
    }
  },
  {
    key: 'closed_at',
    label: 'Closed',
    width: 100,
    format: (height: number, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/block/${height}`}>
          {height}
        </Link>
      )
    }
  },
  {
    key: 'applied_at',
    label: 'Applied',
    width: 100,
    format: (height: number, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/block/${height}`}>
          {height}
        </Link>
      )
    }
  },
  {
    key: 'tally_approve',
    label: 'Approval',
    width: 100,
    format: displayAMO,
  },
  {
    key: 'tally_reject',
    label: 'Disapproval',
    width: 100,
    format: displayAMO,
  },
]

const Governance = () => {
  const chainId = useChainId()
  const [stat, setStat] = useState<DraftStat>({
    num_drafts: 0,
    num_passed: 0,
  })
  const [chainConfig, setChainConfig] = useState<ChainConfig>({})
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [hasMore, setHasMore] = useState<boolean>(false)

  useEffect(() => {
    if (chainId) {
      ExplorerAPI
        .fetchDraftStat(chainId)
        .then(({data}) => {
          setStat(data)
          setHasMore(true)
        })
        .catch((e: AxiosError) => {
        })
      ExplorerAPI
        .fetchChainConfig(chainId)
        .then(({data}) => {
          setChainConfig(data)
        })
        .catch((e: AxiosError) => {
        })
    }
  }, [chainId])

  const fetchDrafts = async (from: number, num: number) => {
    if (chainId && hasMore) {
      const {data} = await ExplorerAPI
        .fetchDrafts(chainId, 0, from, num)
      if (data.length > 0) {
        setDrafts(drafts.concat(data))
      } else {
        setHasMore(false)
      }
    }
  }


  return (
    <>
      <StatCard
        title="Governance Stat"
        size="large"
      >
        <Grid
          container
          spacing={2}
        >
          <StatCard
            icon={ThumbsUpDown}
            title={"# of Drafts"}
            color="#FF6E4A"
          >
            {stat.num_drafts}
          </StatCard>
          <StatCard
            icon={ThumbUpAlt}
            title={"Pass rate"}
            suffix={`%`}
            color="#FF6E4A"
          >
            {(stat.num_drafts > 0 ? stat.num_passed / stat.num_drafts * 100 : 0).toFixed(2)}
          </StatCard>
        </Grid>
        <Grid
          container
          spacing={2}
        >
          <StatCard icon={Timer} title={"Waiting Period (open count)"}>
            {chainConfig.draft_open_count} blks
          </StatCard>
          <StatCard icon={Timer} title={"Voting Period (close count)"}>
            {chainConfig.draft_close_count} blks
          </StatCard>
          <StatCard icon={Timer} title={"Grace Period (apply count)"}>
            {chainConfig.draft_apply_count} blks
          </StatCard>
        </Grid>
      </StatCard>
      <InfiniteTable
        rows={drafts}
        columns={draftListColumn}
        hasMore={hasMore}
        loadMoreRows={fetchDrafts}
      />
    </>
  )
}

export default Governance
