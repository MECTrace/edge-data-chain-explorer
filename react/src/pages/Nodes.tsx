import React, {useEffect, useState} from 'react'
import StatCard from "../component/StatCard"
import {Grid} from "@material-ui/core"
import ExplorerAPI from "../ExplorerAPI"
import {AccountBalance} from "@material-ui/icons"
import CollapseTable from "../component/CollapseTable"
import {useChainId} from "../reducer"
import {Link} from "react-router-dom"

const columns = [
  {
    key: 'node_id',
    header: 'Node ID',
    format: (node_id: string, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/node/${node_id}`}>
          <code>{node_id}</code>
        </Link>
      )
    }
  },
  {
    key: 'moniker',
    header: 'Name(moniker)',
  },
  {
    key: 'val_addr',
    header: 'Validator',
    format: (val_addr: string, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/validator/${val_addr}`}>
          <code>{val_addr}</code>
        </Link>
      )
    }
  },
  {
    key: 'latest_block_height',
    header: 'Latest block',
  },
  {
    key: 'catching_up',
    header: 'Syncing',
  },
  {
    key: 'timestamp',
    header: 'Last time'
  },
  {
    key: 'uptime',
    header: 'Uptime',
  }
]

const Nodes = () => {
  const chainId = useChainId()
  const [nodes, setNodes] = useState<NodeInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ExplorerAPI
      .fetchNodes(chainId, 3600)
      .then(({data}) => {
        setNodes(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [chainId])

  return (
    <>
      <StatCard
        title="Node Stat"
        size="large"
      >
        <Grid
          container
          spacing={2}
        >
          <StatCard
            icon={AccountBalance}
            title={"# of nodes"}
            color="#FF6E4A"
          >
            {/*stat.num_validators*/ 1}
          </StatCard>
        </Grid>
      </StatCard>
      <CollapseTable
        dataSource={nodes}
        columns={columns}
        rowKey="node_id"
        fallbackText="No nodes"
        loading={loading}
      />
    </>
  )
}

export default Nodes
