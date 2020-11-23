import React from 'react'
import {Grid, Paper} from "@material-ui/core"
import {useSelector} from "react-redux"
import {RootState} from "../reducer"
import {BlockchainState} from "../reducer/blockchain"

const GraphCard = () => {
  const blockState = useSelector<RootState, BlockchainState>(state => state.blockchain.blockState)

  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={6}
      lg={6}
    >
      <Paper>
        {blockState.active_coins}
        {blockState.stakes}
      </Paper>
    </Grid>
  )
}

export default GraphCard
