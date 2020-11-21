import React, {useEffect, useState} from 'react'
import StatCard from "../component/StatCard"
import {Grid} from "@material-ui/core"
import ExplorerAPI from "../ExplorerAPI"
import {AccountBalance} from "@material-ui/icons"
import CollapseTable from "../component/CollapseTable"
import {useChainId} from "../reducer"
import {displayAMO} from "../util"
import {Link} from "react-router-dom"

const columns = [
  {
    key: 'storage_id',
    header: 'ID',
    format: (storage_id: string, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/storage/${storage_id}`}>
          <code>{storage_id}</code>
        </Link>
      )
    }
  },
  {
    key: 'owner',
    header: 'Owner',
    format: (owner: string, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/account/${owner}`}>
          <code>{owner}</code>
        </Link>
      )
    }
  },
  {
    key: 'registration_fee',
    header: 'Reg. fee',
    format: (registration_fee: string, chainId: string) => {
      return displayAMO(registration_fee)
    }
  },
  {
    key: 'hosting_fee',
    header: 'Hosting fee',
    format: (hosting_fee: string, chainId: string) => {
      return displayAMO(hosting_fee)
    }
  },
  {
    key: 'active',
    header: 'Status',
    format: (active: boolean, chainId: string) => {
      return active ? 'active' : 'inactive'
    }
  },
]

const Storages = () => {
  const chainId = useChainId()
  const [stat, setStat] = useState<StorageStat>({ num_storages: 0 })
  const [statLoading, setStatLoading] = useState(true)
  const [storages, setStorages] = useState<StorageInfo[]>([])

  useEffect(() => {
    if (chainId) {
      ExplorerAPI
        .fetchStorageStat(chainId)
        .then(({data}) => {
          setStat(data)
          setStatLoading(false)
        })
        .catch(() => {
          setStatLoading(false)
        })

      ExplorerAPI
        .fetchStorages(chainId)
        .then(({data}) => {
          setStorages(data)
        })
        .catch(() => {
        })
    }
  }, [chainId])

  return (
    <>
      <StatCard
        title="Storages Stat"
        size="large"
      >
        <Grid
          container
          spacing={2}
        >
          <StatCard
            icon={AccountBalance}
            title={"# of Storages"}
            color="#FF6E4A"
          >
            {stat.num_storages}
          </StatCard>
        </Grid>
      </StatCard>
      <CollapseTable
        dataSource={storages}
        columns={columns}
        rowKey="storage_id"
        fallbackText="No storages"
        loading={statLoading}
      />
    </>
  )
}

export default Storages
