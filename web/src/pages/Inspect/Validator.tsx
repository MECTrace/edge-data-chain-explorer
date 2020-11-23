import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useUpdateState} from "../../reducer"
import ExplorerAPI, {DelegateItem} from "../../ExplorerAPI"
import InformationCard from "../../component/InformationCard"
import {
  displayAMO,
  displayAMOLong,
  displayAddress,
  displayMono,
} from "../../util"
import CollapseTable from "../../component/CollapseTable"

const columns = [
  {
    key: 'address',
    header: 'Address',
    format: displayMono,
  },
  {
    key: 'pubkey',
    header: 'Public key',
    format: displayMono,
  },
  {
    key: 'owner',
    header: 'Control account',
    format: displayAddress,
  },
  {
    key: 'stake',
    header: 'Stake',
    format: displayAMOLong
  },
  {
    key: 'eff_stake',
    header: 'Effective stake',
    format: displayAMOLong
  },
  {
    key: 'power',
    header: 'Voting power'
  }
]

const delegatorColumns = [
  {
    key: 'address',
    header: 'Delegator',
    format: displayAddress
  },
  {
    key: 'delegate',
    header: 'Delegate Amount',
    format: displayAMO
  }
]

const Validator = () => {
  const {address} = useParams()
  const {chainId, updated} = useUpdateState()
  const [validator, setValidator] = useState<ValidatorAccount>({
    address: '',
    owner: '',
    power: '0',
    pubkey: '',
    stake: '0',
    eff_stake: '0'
  })
  const [delegators, setDelegators] = useState<DelegateItem[]>([])
  const [loading, setLoading] = useState(true)
  const [delegatorsLoading, setDelegatorsLoading] = useState(true)

  useEffect(() => {
    if (updated) {
      ExplorerAPI
        .fetchValidatorAccount(chainId, address as string)
        .then(({data}) => {
          setValidator(data)
          setLoading(false)
        })
      ExplorerAPI
        .fetchDelegators(chainId, address as string, 0)
        .then(({data}) => {
          setDelegators(data)
          setDelegatorsLoading(false)
        })
    }
  }, [chainId, address, updated])

  return (
    <>
      <InformationCard
        columns={columns}
        data={validator}
        title="Validator information"
        loading={loading}
        divider
      />
      <CollapseTable
        dataSource={delegators}
        columns={delegatorColumns}
        rowKey="address"
        fallbackText="No delegators"
        loading={delegatorsLoading}
      />
    </>
  )
}

export default Validator
