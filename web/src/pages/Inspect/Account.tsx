import React, {useEffect, useState} from 'react'
import InformationCard from "../../component/InformationCard"
import ExplorerAPI from "../../ExplorerAPI"
import {useParams} from 'react-router-dom'
import {displayAMOLong} from "../../util"
import {TransactionSchema} from "../../reducer/blockchain"
import {AxiosError} from "axios"
import {
  txColumns,
  incentiveColumns,
  balanceHistoryColumns,
  penaltyColumns
} from "../../component/columns"
import {useDispatch} from "react-redux"
import {replace} from "connected-react-router"
import {Tabs, Tab, Container} from "@material-ui/core"
import InfiniteTable from "../../component/InfiniteTable"
import {useChainId, useHeight} from "../../reducer"

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
  const dispatch = useDispatch()
  const chainId = useChainId()
  const height = useHeight()

  // first section
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

  // second section
  const [anchorHeight, setAnchorHeight] = useState<number>(0)
  const [tab, setTab] = useState<number>(0)
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistory[]>([])
  const [txs, setTxs] = useState<TransactionSchema[]>([])
  const [incentives, setIncentives] = useState<Incentive[]>([])
  const [penalties, setPenalties] = useState<Penalty[]>([])
  const [hasMoreHistory, setHasMoreHistory] = useState<boolean>(false)
  const [hasMoreTxs, setHasMoreTxs] = useState<boolean>(false)
  const [hasMoreIncentives, setHasMoreIncentives] = useState<boolean>(false)
  const [hasMorePenalties, setHasMorePenalties] = useState<boolean>(false)

  const handleTabChange = (e: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue)
  }

  useEffect(() => {
    if (height > 0 && anchorHeight === 0) {
      setAnchorHeight(height)
    }
  }, [height, anchorHeight])

  useEffect(() => {
    setHasMoreHistory(false)
    setHasMoreTxs(false)
    setHasMoreIncentives(false)
    setHasMorePenalties(false)
    setBalanceHistory([])
    setTxs([])
    setIncentives([])
    setPenalties([])
    if (chainId && address && anchorHeight) {
      ExplorerAPI
        .fetchAccount(chainId, address as string)
        .then(({data}) => {
          setAccount(data)
          // preload table items before handover the control to InfiniteTable
          console.log('fetchBalanceHistory', anchorHeight, 0);
          ExplorerAPI
          .fetchBalanceHistory(chainId, address, anchorHeight, 0, 20)
          .then(({data}) => {
            if (data.length > 0) {
              setBalanceHistory(data)
              setHasMoreHistory(true)
            }
          })
          console.log('fetchAccountTransactions', anchorHeight, 0);
          ExplorerAPI
          .fetchAccountTransactions(chainId, address, anchorHeight, 0, 20)
          .then(({data}) => {
            if (data.length > 0) {
              setTxs(data)
              setHasMoreTxs(true)
            }
          })
          console.log('fetchAccountIncentives', anchorHeight, 0);
          ExplorerAPI
          .fetchAccountIncentives(chainId, address, anchorHeight, 0, 20)
          .then(({data}) => {
            if (data.length > 0) {
              setIncentives(data)
              setHasMoreIncentives(true)
            }
          })
          console.log('fetchAccountPenalties', anchorHeight, 0);
          ExplorerAPI
          .fetchAccountPenalties(chainId, address, anchorHeight, 0, 20)
          .then(({data}) => {
            if (data.length > 0) {
              setPenalties(data)
              setHasMorePenalties(true)
            }
          })
          // preload table items done
          setStatLoading(false)
        })
        .catch((e: AxiosError) => {
          dispatch(replace(`/${chainId}/inspect/404`, {type: 'ACCOUNT', search: address}))
          setStatLoading(false)
        })
    }
  }, [chainId, address, anchorHeight, dispatch])

  const fetchBalanceHistory = async (from: number, num: number) => {
    console.log('fetchBalanceHistory', anchorHeight, from);
    if (chainId && address && hasMoreHistory) {
      const {data} = await ExplorerAPI
        .fetchBalanceHistory(chainId, address, anchorHeight, from, num)
      if (data.length > 0) {
        setBalanceHistory(balanceHistory.concat(data))
      } else {
        setHasMoreHistory(false)
      }
    }
  }

  const fetchAccountTransactions = async (from: number, num: number) => {
    console.log('fetchAccountTransactions', anchorHeight, from);
    if (chainId && address && hasMoreTxs) {
      const {data} = await ExplorerAPI
        .fetchAccountTransactions(chainId, address, anchorHeight, from, num)
      if (data.length > 0) {
        setTxs(txs.concat(data))
      } else {
        setHasMoreTxs(false)
      }
    }
  }

  const fetchAccountIncentives = async (from: number, num: number) => {
    console.log('fetchAccountIncentives', anchorHeight, from);
    if (chainId && address && hasMoreIncentives) {
      const {data} = await ExplorerAPI
        .fetchAccountIncentives(chainId, address, anchorHeight, from, num)
      if (data.length > 0) {
        setIncentives(incentives.concat(data))
      } else {
        setHasMoreIncentives(false)
      }
    }
  }

  const fetchAccountPenalties = async (from: number, num: number) => {
    console.log('fetchAccountPenalties', anchorHeight, from);
    if (chainId && address && hasMorePenalties) {
      const {data} = await ExplorerAPI
        .fetchAccountPenalties(chainId, address, anchorHeight, from, num)
      if (data.length > 0) {
        setPenalties(penalties.concat(data))
      } else {
        setHasMorePenalties(false)
      }
    }
  }

  return (
    <>
      <InformationCard
        title="Account information"
        columns={infoColumns}
        data={account}
        divider
        loading={statLoading}
      />
      <Container>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Balance History"/>
          <Tab label="Sent Txs"/>
          <Tab label="Incentives"/>
          <Tab label="Penalties"/>
        </Tabs>
      </Container>
      <Container style={{padding:"0 8px"}}>
        <div hidden={tab !== 0}>
          <InfiniteTable
            rows={balanceHistory}
            columns={balanceHistoryColumns}
            hasMore={hasMoreHistory}
            loadMoreRows={fetchBalanceHistory}
          />
        </div>
        <div hidden={tab !== 1}>
          <InfiniteTable
            rows={txs}
            columns={txColumns}
            hasMore={hasMoreTxs}
            loadMoreRows={fetchAccountTransactions}
          />
        </div>
        <div hidden={tab !== 2}>
          <InfiniteTable
            rows={incentives}
            columns={incentiveColumns}
            hasMore={hasMoreIncentives}
            loadMoreRows={fetchAccountIncentives}
          />
        </div>
        <div hidden={tab !== 3}>
          <InfiniteTable
            rows={penalties}
            columns={penaltyColumns}
            hasMore={hasMorePenalties}
            loadMoreRows={fetchAccountPenalties}
          />
        </div>
      </Container>
    </>
  )
}

export default Account
