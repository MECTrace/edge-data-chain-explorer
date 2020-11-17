import React, {useCallback, useState} from 'react'
import InformationCard from "../../component/InformationCard"
import ExplorerAPI from "../../ExplorerAPI"
import {useParams} from 'react-router-dom'
import {displayAMOLong} from "../../util"
import {TransactionSchema} from "../../reducer/blockchain"
import {AxiosError} from "axios"
import InfinityTable from "../../component/InfinityTable"
import {txColumns, incentiveColumns} from "../../component/columns"
import useScrollUpdate from "../../hooks/useScrollUpdate"
import {useDispatch} from "react-redux"
import {replace} from "connected-react-router"
import {Tabs, Tab, Container} from "@material-ui/core"
import useEnsureNetwork from "../../hooks/useEnsureNetwork"

const infoColumns = [
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
    format: displayAMOLong
  },
  {
    key: 'stake',
    header: 'Stake',
    format: displayAMOLong
  },
  {
    key: 'delegate',
    header: 'Delegate',
    format: displayAMOLong
  }
]

const Account = () => {
  const {address} = useParams()

  const [account, setAccount] = useState<AccountInfo>({
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
  const [tab, setTab] = useState<number>(0)
  const dispatch = useDispatch()

  const handleTabChange = (e: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue)
  }

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
  const [txList, loading, onTxScroll] = useScrollUpdate<TransactionSchema>(fetchAccountTransactions, ref)

  const fetchAccountIncentives = useCallback(
    async (size: number, fixedHeight: number, chainId: string) => {
    if (fixedHeight !== -1) {
      const {data} = await ExplorerAPI.fetchAccountIncentives(
        chainId, address, fixedHeight, size)
      return data
    }
    return null
  }, [address])
  const [incentiveList, incLoading, onIncScroll] = useScrollUpdate<Incentive>(fetchAccountIncentives, ref)

  return (
    <>
      <InformationCard
        setRef={setRef}
        title="Account information"
        columns={infoColumns}
        data={account}
        divider
        loading={statLoading}
      />
      <Container>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Sent Txs"/>
          <Tab label="Incentives"/>
          <Tab label="Penalties"/>
        </Tabs>
      </Container>
      <Container style={{padding:"0 8px"}}>
        <div hidden={tab !== 0}>
          <InfinityTable
            onScroll={onTxScroll}
            columns={txColumns}
            rowKey="hash"
            data={txList}
            loading={loading}
          />
        </div>
        <div hidden={tab !== 1}>
          <InfinityTable
            onScroll={onIncScroll}
            columns={incentiveColumns}
            rowKey="hash"
            data={incentiveList}
            loading={incLoading}
          />
        </div>
      </Container>
    </>
  )
}

export default Account
