import React, {useCallback, useState} from 'react'
import InformationCard from "../../component/InformationCard"
import ExplorerAPI from "../../ExplorerAPI"
import {useParams} from 'react-router-dom'
import {displayAmount} from "../../util"
import {TransactionSchema} from "../../reducer/blockchain"
import {AxiosError} from "axios"
import InfinityTable from "../../component/InfinityTable"
import {transactionColumns} from "../../component/columns"
import useScrollUpdate from "../../hooks/useScrollUpdate"
import {useDispatch} from "react-redux"
import {replace} from "connected-react-router"
import useEnsureNetwork from "../../hooks/useEnsureNetwork"

const columns = [
  {
    key: 'address',
    header: 'Address',
    format: (address: string) => {
      return (
        <code>{address}</code>
      )
    }
  },
  {
    key: 'balance',
    header: 'Balance',
    format: displayAmount
  },
  {
    key: 'stake',
    header: 'Stake',
    format: displayAmount
  },
  {
    key: 'delegate',
    header: 'Delegate',
    format: displayAmount
  }
]

const Account = () => {
  const {address} = useParams()

  const [account, setAccount] = useState<AccountSchema>({
    address: address as string,
    balance: '0',
    chain_id: '',
    del_addr: '',
    delegate: '0',
    stake: '0',
    val_addr: '',
    val_power: '0',
    val_pubkey: ''
  })
  const [statLoading, setStatLoading] = useState(true)
  const [ref, setRef] = useState<HTMLDivElement | undefined>(undefined)
  const dispatch = useDispatch()

  const fetchAccount = useCallback((chainId: string) => {
    ExplorerAPI
      .fetchAccount(chainId, address as string)
      .then(({data}) => {
        setAccount(data)
        setStatLoading(false)
      })
      .catch((e: AxiosError) => {
        dispatch(replace(`/${chainId}/inspect/404`, {type: 'ACCOUNT', search: address}))
        setStatLoading(false)
      })
  }, [address, dispatch])
  useEnsureNetwork(fetchAccount)

  const fetchAccountTransactions = useCallback(async (size: number, fixedHeight: number, chainId: string) => {
    if (fixedHeight !== -1) {
      const {data} = await ExplorerAPI.fetchAccountTransactions(chainId, address as string, fixedHeight, size)
      return data
    }
    return null
  }, [address])
  const [list, loading, onScroll] = useScrollUpdate<TransactionSchema>(fetchAccountTransactions, ref)

  return (
    <>
      <InformationCard
        setRef={setRef}
        title="Account information"
        columns={columns}
        data={account}
        divider
        loading={statLoading}
      />
      <InfinityTable
        onScroll={onScroll}
        columns={transactionColumns}
        rowKey="hash"
        data={list}
        loading={loading}
      />
    </>
  )
}

export default Account
