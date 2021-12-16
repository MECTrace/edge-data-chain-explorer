import React, {useEffect, useState} from 'react'
import ExplorerAPI from "../../ExplorerAPI"
import InfiniteTable from "../../component/InfiniteTable"
import InformationCard from "../../component/InformationCard"
import moment from 'moment'
import {BlockInfo, initialBlock} from "../../reducer/blocks"
import {Link, useParams} from 'react-router-dom'
import {TransactionSchema} from "../../reducer/blockchain"
import {replace} from "connected-react-router"
import {useChainId} from "../../reducer"
import {useDispatch} from "react-redux"
import {txColumns} from "../../component/columns"

const infoColumns = [
  {
    key: 'height',
    header: 'Height'
  },
  {
    key: 'hash',
    header: 'Hash',
    format: (hash: string) => {
      return (
        <code>{hash}</code>
      )
    }
  },
  {
    key: 'proposer',
    header: 'Proposer',
    format: (validator: string, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/validator/${validator}`}>
          <code>{validator}</code>
        </Link>
      )
    }
  },
  {
    key: 'time',
    header: 'Time',
    format: (time: string, chainId: string, data: BlockInfo) => {
      return `${moment(time).fromNow()} (${moment(time).format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}) (+${data.interval.toFixed(3)} sec)`
    }
  },
  {
    key: 'num_txs',
    header: '# of txs'
  }
]

const Block = () => {
  const dispatch = useDispatch()
  const chainId = useChainId()

  // first section
  const {height} = useParams()
  const [block, setBlock] = useState<BlockInfo>(initialBlock)
  const [statLoading, setStatLoading] = useState(true)

  // second section
  const [txs, setTxs] = useState<TransactionSchema[]>([])
  const [hasMoreTxs, setHasMoreTxs] = useState<boolean>(false)

  useEffect(() => {
    setHasMoreTxs(false)
    setTxs([])
    if (chainId && height) {
      ExplorerAPI
        .fetchBlock(chainId, height as number)
        .then(({data}) => {
          setBlock(data)
          // preload table items before handover the control to InfiniteTable
          ExplorerAPI
          .fetchBlockTransactions(chainId, height, 0, 20)
          .then(({data}) => {
            setTxs(data)
            if (data.length >= 20) {
              setHasMoreTxs(true)
            }
          })
          // preload table items done
          setStatLoading(false)
        })
        .catch(() => {
          dispatch(replace(`/${chainId}/inspect/404`,
                           {type: 'BLOCK', search: height}))
          setStatLoading(false)
        })
    }
  }, [chainId, height, dispatch])

  const fetchBlockTxs = async (from: number, num: number) => {
    if (chainId && height && hasMoreTxs) {
      const {data} = await ExplorerAPI
        .fetchBlockTransactions(chainId, height, from, num)
      if (data.length > 0) {
        setTxs(txs.concat(data))
      } else {
        setHasMoreTxs(false)
      }
  }
  }

  return (
    <>
      <InformationCard
        title="Block information"
        columns={infoColumns}
        data={block}
        divider
        loading={statLoading}
      />
      <InfiniteTable
        rows={txs}
        columns={txColumns}
        hasMore={hasMoreTxs}
        loadMoreRows={fetchBlockTxs}
      />
    </>
  )
}

export default Block
