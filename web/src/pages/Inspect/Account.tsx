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
  penaltyColumns
} from "../../component/columns"
import {useDispatch} from "react-redux"
import {replace} from "connected-react-router"
import {Tabs, Tab, Container} from "@material-ui/core"
import InfiniteTable from "../../component/InfiniteTable"
import {useChainId} from "../../reducer"

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
  const [tab, setTab] = useState<number>(0)
  const [txs, setTxs] = useState<TransactionSchema[]>([])
  const [incentives, setIncentives] = useState<Incentive[]>([])
  const [penalties, setPenalties] = useState<Penalty[]>([])
  const [hasMoreTxs, setHasMoreTxs] = useState<boolean>(false)
  const [hasMoreIncentives, setHasMoreIncentives] = useState<boolean>(false)
  const [hasMorePenalties, setHasMorePenalties] = useState<boolean>(false)

  const handleTabChange = (e: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue)
  }

  useEffect(() => {
    setTxs([])
    setIncentives([])
    setPenalties([])
    if (chainId && address) {
      ExplorerAPI
        .fetchAccount(chainId, address as string)
        .then(({data}) => {
          setAccount(data)
          setStatLoading(false)
          setHasMoreTxs(true)
          setHasMoreIncentives(true)
          setHasMorePenalties(true)
        })
        .catch((e: AxiosError) => {
          dispatch(replace(`/${chainId}/inspect/404`, {type: 'ACCOUNT', search: address}))
          setStatLoading(false)
        })
    }
  }, [chainId, address, dispatch])

  const fetchAccountTransactions = async (from: number, num: number) => {
    if (chainId && address && hasMoreTxs) {
      const {data} = await ExplorerAPI
        .fetchAccountTransactions(chainId, address, 0, from, num)
      if (data.length > 0) {
        setTxs(txs.concat(data))
      } else {
        setHasMoreTxs(false)
      }
    }
  }

  const fetchAccountIncentives = async (from: number, num: number) => {
    if (chainId && address && hasMoreIncentives) {
      const {data} = await ExplorerAPI
        .fetchAccountIncentives(chainId, address, 0, from, num)
      if (data.length > 0) {
        setIncentives(incentives.concat(data))
      } else {
        setHasMoreIncentives(false)
      }
    }
  }

  const fetchAccountPenalties = async (from: number, num: number) => {
    if (chainId && address && hasMorePenalties) {
      const {data} = await ExplorerAPI
        .fetchAccountPenalties(chainId, address, 0, from, num)
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
          <Tab label="Sent Txs"/>
          <Tab label="Incentives"/>
          <Tab label="Penalties"/>
        </Tabs>
      </Container>
      <Container style={{padding:"0 8px"}}>
        <div hidden={tab !== 0}>
          <InfiniteTable
            rows={txs}
            columns={txColumns}
            hasMore={hasMoreTxs}
            loadMoreRows={fetchAccountTransactions}
          />
        </div>
        <div hidden={tab !== 1}>
          <InfiniteTable
            rows={incentives}
            columns={incentiveColumns}
            hasMore={hasMoreIncentives}
            loadMoreRows={fetchAccountIncentives}
          />
        </div>
        <div hidden={tab !== 2}>
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
