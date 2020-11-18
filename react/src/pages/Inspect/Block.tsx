import React, {useCallback, useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {BlockState, initialBlock} from "../../reducer/blocks"
import {useChainId} from "../../reducer"
import ExplorerAPI from "../../ExplorerAPI"
import InformationCard from "../../component/InformationCard"
import InfinityTable from "../../component/InfinityTable"
import {TransactionSchema} from "../../reducer/blockchain"
import moment from 'moment'
import {displayAMO, displayResult} from "../../util"
import {useDispatch} from "react-redux"
import {replace} from "connected-react-router"
import useScrollUpdate from "../../hooks/useScrollUpdate"

const columns = [
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
    format: (time: string, chainId: string, data: BlockState) => {
      return `${moment(time).fromNow()} (${moment(time).format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}) (+${data.interval.toFixed(3)} sec)`
    }
  },
  {
    key: 'num_txs',
    header: '# of txs'
  }
]

const transactionColumns = [
  {
    key: 'index',
    label: 'Index',
    width: 100,
    flexGrow: 1,
  },
  {
    key: 'hash',
    label: 'Hash',
    width: 100,
    flexGrow: 8,
    columnData: {
      format: (hash: string, chainId: string) => {
        return (
          <Link to={`/${chainId}/inspect/tx/${hash}`}>
            <code>{hash}</code>
          </Link>
        )
      }
    }
  },
  {
    key: 'sender',
    label: 'Sender',
    width: 100,
    flexGrow: 5,
    columnData: {
      format: (sender: string, chainId: string) => {
        return (
          <Link to={`/${chainId}/inspect/account/${sender}`}>
            <code>{sender}</code>
          </Link>
        )
      }
    }
  },
  {
    key: 'type',
    label: 'Type',
    width: 100,
    flexGrow: 1,
  },
  {
    key: 'fee',
    label: 'Tx Fee',
    width: 100,
    flexGrow: 1,
    columnData: {
      format: displayAMO
    }
  },
  {
    key: 'info',
    label: 'Result',
    width: 100,
    flexGrow: 1,
    columnData: {
      format: displayResult
    }
  }
]

const Block = () => {
  const {height} = useParams()

  const [block, setBlock] = useState<BlockState>(initialBlock)
  const chainId = useChainId()

  const [blockLoading, setBlockLoading] = useState(true)
  const [ref, setRef] = useState<HTMLDivElement | undefined>(undefined)
  const dispatch = useDispatch()

  useEffect(() => {
    if (height) {
      const blockHeight = parseInt(height)
      ExplorerAPI
        .fetchBlock(chainId, blockHeight)
        .then(({data}) => {
          setBlock(data)
          setBlockLoading(false)
        })
        .catch(() => {
          dispatch(replace(`/${chainId}/inspect/404`, {type: 'BLOCK', search: height}))
          setBlockLoading(false)
        })
    }
  }, [chainId, height, dispatch])

  const fetchBlockTransactions = useCallback(async (size: number, fixedHeight: number, chainId: string) => {
    const blockHeight = parseInt(height)
    if (fixedHeight !== -1) {
      const {data} = await ExplorerAPI.fetchBlockTransactions(chainId, blockHeight, size)
      return data
    }
    return null
  }, [height])
  const [list, txLoading, onScroll] = useScrollUpdate<TransactionSchema>(fetchBlockTransactions, ref)

  return (
    <>
      <InformationCard
        title="Block information"
        setRef={setRef}
        columns={columns}
        data={block}
        divider
        loading={blockLoading}
      />
      <InfinityTable
        onScroll={onScroll}
        columns={transactionColumns}
        rowKey="hash"
        data={list}
        loading={txLoading}
      />
    </>
  )
}

export default Block
