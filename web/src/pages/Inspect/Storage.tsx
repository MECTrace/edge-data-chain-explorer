import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useUpdateState} from "../../reducer"
import ExplorerAPI from "../../ExplorerAPI"
import InformationCard from "../../component/InformationCard"
import {useDispatch} from "react-redux"
import {replace} from "connected-react-router"
import {
  displayAMO,
  displayAddress,
  displayMono,
} from "../../util"
//import CollapseTable from "../../component/CollapseTable"

const columns = [
  {
    key: 'storage_id',
    header: 'ID',
    format: displayMono
  },
  {
    key: 'owner',
    header: 'Owner',
    format: displayAddress
  },
  {
    key: 'registration_fee',
    header: 'Registration fee',
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

const Storage = () => {
  const dispatch = useDispatch()
  const {storage_id} = useParams()
  const {chainId, updated} = useUpdateState()
  const [storage, setStorage] = useState<StorageInfo>({
    chain_id: '',
    storage_id: 0,
    url: '',
    registration_fee: '',
    hosting_fee: '',
    owner: '',
    active: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ExplorerAPI
      .fetchStorage(chainId, storage_id as number)
      .then(({data}) => {
        setStorage(data)
        setLoading(false)
      })
      .catch(() => {
        dispatch(replace(`/${chainId}/inspect/404`, {type: 'STORAGE', search: storage_id}))
      })
  }, [dispatch, chainId, storage_id, updated])

  return (
    <>
      <InformationCard
        columns={columns}
        data={storage}
        title="Storage information"
        loading={loading}
        divider
      />
    </>
  )
}

export default Storage
