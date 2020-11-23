import React, {useEffect, useState} from 'react'
import ExplorerAPI from "../ExplorerAPI"
import InfiniteTable from "../component/InfiniteTable"
import SizeTitle, {LastOptions} from "../component/SizeTitle"
import StatCard from "../component/StatCard"
import {Equalizer, HighlightOff, Speed, Timelapse} from "@material-ui/icons"
import {Grid} from "@material-ui/core"
import {TransactionSchema} from "../reducer/blockchain"
import {txColumns} from "../component/columns"
import {useChainId, useHeight} from "../reducer"

const TxsStats = () => {
  const [txStat, setTxStat] = useState<TxStat>({
    chain_id: 'amo-cherrryblossom-01',
    avg_binding_lag: 0,
    avg_fee: 0,
    avg_tx_bytes: 0,
    max_binding_lag: 0,
    num_txs: 0,
    num_txs_invalid: 0,
    num_txs_valid: 0,
    tx_height: 1
  })
  const chainId = useChainId()

  const onSizeChange = (txs: number) => {
    ExplorerAPI
      .fetchTxStat(chainId, txs)
      .then(({data}) => {
        setTxStat(data)
      })
  }

  useEffect(() => {
    onSizeChange(100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId])

  return (
    <>
      <StatCard
        title={<SizeTitle target="Tx" values={LastOptions} onSizeChange={onSizeChange}/>}
        size="large"
      >
        <Grid
          container
          spacing={2}
        >
          <StatCard
            icon={Speed}
            title={"Average binding lag"}
            suffix={`blks`}
            color="#FF6E4A"
          >
            {txStat.avg_binding_lag.toFixed(2)}
          </StatCard>
          <StatCard
            icon={HighlightOff}
            title={"Invalid Transaction ratio"}
            suffix={`/ ${txStat.num_txs}`}
            color="#9179F2"
          >
            {txStat.num_txs_invalid}
          </StatCard>
          <StatCard
            icon={Timelapse}
            title={"Average Tx bytes"}
            suffix={`B`}
            color="#62D96B"
          >
            {txStat.avg_tx_bytes}
          </StatCard>
          <StatCard
            icon={Equalizer}
            title={"Average fee"}
            suffix={`/ tx`}
          >
            {txStat.avg_fee.toFixed(2)}
          </StatCard>
        </Grid>
      </StatCard>
    </>
  )
}

const Transactions = () => {
  const chainId = useChainId()
  const lastHeight = useHeight()

  // first section

  // second section
  const [txs, setTxs] = useState<TransactionSchema[]>([])
  const [hasMoreTxs, setHasMoreTxs] = useState<boolean>(false)

  useEffect(() => {
    setTxs([])
    if (chainId && lastHeight) {
      setHasMoreTxs(true)
    }
  }, [chainId, lastHeight])

  const fetchTxs = async (from: number, num: number) => {
    if (chainId && hasMoreTxs) {
      const {data} = await ExplorerAPI
        .fetchTransactions(chainId, lastHeight, from, num)
      if (data.length > 0) {
        setTxs(txs.concat(data))
      } else {
        setHasMoreTxs(false)
      }
    }
  }

  return (
    <>
      <TxsStats/>
      <InfiniteTable
        rows={txs}
        columns={txColumns}
        hasMore={hasMoreTxs}
        loadMoreRows={fetchTxs}
      />
    </>
  )
}

export default Transactions
