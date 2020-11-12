import React, {useEffect, useState} from 'react'
import StatCard from "../component/StatCard"
import {Grid} from "@material-ui/core"
import ExplorerAPI from "../ExplorerAPI"
import {AccountBalance} from "@material-ui/icons"
import CollapseTable from "../component/CollapseTable"
import {useChainId} from "../reducer"
import {AMO} from "../util"
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
      return AMO(registration_fee)
    }
  },
  {
    key: 'hosting_fee',
    header: 'Hosting fee',
    format: (hosting_fee: string, chainId: string) => {
      return AMO(hosting_fee)
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
  const [loading, setLoading] = useState(true)
  const [storages, setStorages] = useState<StorageInfo[]>([])

  useEffect(() => {
    ExplorerAPI
      .fetchStorages(chainId)
      .then(({data}) => {
        setStorages(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
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
            {1}
          </StatCard>
        </Grid>
      </StatCard>
      <CollapseTable
        dataSource={storages}
        columns={columns}
        rowKey="storage_id"
        fallbackText="No storages"
        loading={loading}
      />
    </>
  )
}

export default Storages
