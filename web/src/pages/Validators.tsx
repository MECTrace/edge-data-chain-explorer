import React, {useEffect, useState} from 'react'
import StatCard from "../component/StatCard"
import {Grid} from "@material-ui/core"
import ExplorerAPI from "../ExplorerAPI"
import {AccountBalance, AllInclusive, CompareArrows} from "@material-ui/icons"
import CollapseTable from "../component/CollapseTable"
import {useChainId} from "../reducer"
import {displayAMO} from "../util"
import {Link} from "react-router-dom"

const columns = [
  {
    key: 'address',
    header: 'Address',
    format: (validator: string, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/validator/${validator}`}>
          <code>{validator}</code>
        </Link>
      )
    }
  },
  {
    key: 'eff_stake',
    header: 'Eff. Stake',
  },
  {
    key: 'power',
    header: 'Power',
    format: (power: string) => {
      return Number(power).toPrecision(5)
    }
  },
]

const Validators = () => {
  const chainId = useChainId()
  const [stat, setStat] = useState<ValidatorStat>({
    num_validators: 0,
    avg_blk_incentive: '0',
    avg_eff_stake: 0,
    total_eff_stakes: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ExplorerAPI
      .fetchValidatorStat(chainId)
      .then(({data}) => {
        setStat(data)
      })
  }, [chainId])

  const [validators, setValidators] = useState<ValidatorAccount[]>([])

  useEffect(() => {
    if (stat.avg_eff_stake !== 0) {
      ExplorerAPI
        .fetchValidators(chainId, 0)
        .then(({data}) => {
          const validators = data.map((v) => {
            const percent = ((Number(v.eff_stake) / stat.total_eff_stakes) * 100).toFixed(2)
            return {
              ...v,
              eff_stake: `${displayAMO(Number(v.eff_stake))} (${percent}%)`
            }
          })

          setValidators(validators)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }, [stat, chainId])

  return (
    <>
      <StatCard
        title="Validator Stat"
        size="large"
      >
        <Grid
          container
          spacing={2}
        >
          <StatCard
            icon={AccountBalance}
            title={"# of validators"}
            color="#FF6E4A"
          >
            {stat.num_validators}
          </StatCard>
          <StatCard
            icon={AllInclusive}
            title={"Average incentive"}
            suffix={`/ blk`}
            color="#62D96B"
          >
            {displayAMO(stat.avg_blk_incentive)}
          </StatCard>
          <StatCard
            icon={CompareArrows}
            title={"Total effective stakes"}
            color="#9179F2"
          >
            {displayAMO(stat.total_eff_stakes)}
          </StatCard>
          <StatCard
            icon={CompareArrows}
            title={"Average effective stake"}
            suffix={`/ validator`}
          >
            {displayAMO(stat.avg_eff_stake)}
          </StatCard>
        </Grid>
      </StatCard>
      <CollapseTable
        dataSource={validators}
        columns={columns}
        rowKey="address"
        fallbackText="No validators"
        loading={loading}
      />
    </>
  )
}

export default Validators
