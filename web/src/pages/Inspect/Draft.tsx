import React, {useEffect, useState} from 'react'
import {useDispatch} from "react-redux"
import {useParams} from 'react-router-dom'
import {AxiosError} from "axios"
import {replace} from "connected-react-router"

import ExplorerAPI from "../../ExplorerAPI"
import {useChainId} from "../../reducer"
import InformationCard from "../../component/InformationCard"
import CollapseTable from "../../component/CollapseTable"
import {displayAddress} from "../../util"
import {voteColumns} from "../../component/columns"

const infoColumns = [
  {
    key: 'draft_id',
    header: 'Draft ID',
  },
  {
    key: 'proposer',
    header: 'Proposer',
    format: displayAddress,
  },
  {
    key: 'desc',
    header: 'Description',
  },
  {
    key: 'open_count',
    header: 'Blocks until vote opening',
  },
  {
    key: 'close_count',
    header: 'Blocks until vote closing',
  },
  {
    key: 'apply_count',
    header: 'Blocks until applying config change',
  },
  {
    key: 'config',
    header: 'Proposed config change',
    format: (config: string) => {
      const obj = JSON.parse(config)
      const str = JSON.stringify(obj, null, 2)
      return (<pre><code>{str}</code></pre>)
    },
  },
]

const Draft = () => {
  const dispatch = useDispatch()
  const chainId = useChainId()

  // first section
  const {draft_id} = useParams()
  const [draft, setDraft] = useState<Draft>({
    chain_id: '',
    draft_id: 0,
    proposer: '',
    config: {},
    desc: '',
    open_count: 0,
    close_count: 0,
    apply_count: 0,
    deposit: '0',
    tally_approve: '0',
    tally_reject: '0',
    tally_deposit: '0',
  })
  const [statLoading, setStatLoading] = useState(true)

  // second section
  const [votes, setVotes] = useState<Vote[]>([])

  useEffect(() => {
    //setTxs([])
    if (chainId && draft_id) {
      ExplorerAPI
        .fetchDraft(chainId, draft_id as number)
        .then(({data}) => {
          setDraft(data)
          ExplorerAPI
            .fetchVotes(chainId, draft_id as number)
            .then(({data}) => {
              setVotes(data)
            })
          setStatLoading(false)
        })
        .catch((e: AxiosError) => {
          dispatch(replace(`/${chainId}/inspect/404`, {type: 'DRAFT', search: draft_id}))
          setStatLoading(false)
        })
    }
  }, [chainId, draft_id, dispatch])

  return (
    <>
      <InformationCard
        title="Draft information"
        columns={infoColumns}
        data={draft}
        divider
        loading={statLoading}
      />
      <CollapseTable
        dataSource={votes}
        columns={voteColumns}
        rowKey="voter"
        fallbackText="No votes"
      />
    </>
  )
}

export default Draft
