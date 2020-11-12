import React, {useEffect, useMemo, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import InformationCard from "../../component/InformationCard"
import {initialTransactions, TransactionSchema} from "../../reducer/blockchain"
import ExplorerAPI from "../../ExplorerAPI"
import {useUpdateState} from "../../reducer"
import {
  AMO, displayAddress, displayAmount, displayResult, displayMono
} from "../../util"
import {Grid, Link as UrlLink} from "@material-ui/core"
import {useDispatch} from "react-redux"
import {replace} from "connected-react-router"

const payloadColumns: StringMap = {
  transfer: [
    {
      key: 'to',
      header: 'To',
      format: displayAddress
    },
    {
      key: 'amount',
      header: 'Amount',
      format: displayAmount
    }
  ],
  register: [
    {
      key: 'target',
      header: 'Target Parcel',
      format: displayMono, // TODO: displayParcel
    },
    {
      key: 'custody',
      header: 'Owner Key Custody',
      format: displayMono,
    }
  ],
  stake: [
    {
      key: 'validator',
      header: 'Validator Public Key',
      format: displayMono,
    },
    {
      key: 'amount',
      header: 'Amount',
      format: displayAmount
    }
  ],
  issue: [
    {
      key: 'udc',
      header: 'UDC ID'
    },
    {
      key: 'desc',
      header: 'Description'
    },
    {
      key: 'amount',
      header: 'Amount',
      format: displayAmount
    }
  ],
  delegate: [
    {
      key: 'to',
      header: 'Delegatee',
      format: displayAddress,
    },
    {
      key: 'amount',
      header: 'Amount',
      format: displayAmount
    }
  ],
  setup: [
    {
      key: 'storage',
      header: 'Storage ID'
    },
    {
      key: 'url',
      header: 'URL',
      format: (url: string) => {
        return (
          <UrlLink href={url}>
            {url}
          </UrlLink>
        )
      }
    },
    {
      key: 'registration_fee',
      header: 'Registration fee',
      format: displayAmount,
    },
    {
      key: 'hosting_fee',
      header: 'Hosting fee',
      format: displayAmount,
    }
  ],
  propose: [], // TODO
  retract: [
    {
      key: 'amount',
      header: 'Amount',
      format: displayAmount
    }
  ],
  close: [
    {
      key: 'storage',
      header: 'Storage ID'
    }
  ],
  lock: [
    {
      key: 'udc',
      header: 'UDC ID'
    },
    {
      key: 'holder',
      header: 'Holder',
      format: displayAddress
    },
    {
      key: 'amount',
      header: 'Amount',
      format: displayAmount
    }
  ],
  withdraw: [
    {
      key: 'amount',
      header: 'Amount',
      format: displayAmount
    }
  ],
  vote: [
    {
      key: 'draft_id',
      header: 'Draft ID'
    },
    {
      key: 'approve',
      header: 'Approve',
      format: (approve: boolean) => {
        return `${approve}`
      }
    }
  ],
  request: [
    {
      key: 'target',
      header: 'Target Parcel',
      format: displayMono,
    },
    {
      key: 'payment',
      header: 'Payment',
      format: displayAmount
    }
  ],
  grant: [
    {
      key: 'target',
      header: 'Target Parcel',
      format: displayMono,
    }
  ],
  cancel: [
    {
      key: 'target',
      header: 'Target Parcel',
      format: displayMono,
    }
  ],
  revoke: [
    {
      key: 'target',
      header: 'Target Parcel',
      format: displayMono,
    },
    {
      key: 'grantee',
      header: 'Grantee',
      format: displayAddress
    }
  ],
  burn: [
    {
      key: 'udc',
      header: 'UDC ID'
    },
    {
      key: 'amount',
      header: 'Amount',
      format: (amount: string) => {
        return Number(amount).toLocaleString()
      }
    }
  ],
  unknown: [],
}

const columns = [
  {
    key: 'hash',
    header: 'Hash'
  },
  {
    key: 'sender',
    header: 'Sender',
    format: displayAddress,
  },
  {
    key: 'height',
    header: 'Height',
    format: (height: number, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/block/${height}`}>
          {height}
        </Link>
      )
    }
  },
  {
    key: 'index',
    header: 'Index'
  },
  {
    key: 'fee',
    header: 'Fee',
    format: AMO
  },
  {
    key: 'tx_bytes',
    header: 'Tx bytes'
  },
]

const payloadSpecificColumns = [
  {
    key: 'type',
    header: 'Type'
  },
  {
    key: 'info',
    header: 'Result',
    format: displayResult
  }
]

const Transaction = () => {
  const {hash} = useParams()
  const [tx, setTx] = useState<TransactionSchema>({
    hash,
    ...initialTransactions
  })
  const [loading, setLoading] = useState(true)

  const {chainId, updated} = useUpdateState()
  const dispatch = useDispatch()

  useEffect(() => {
    if (updated && tx.sender === "") {
      ExplorerAPI
        .fetchTransaction(chainId, hash as string)
        .then(({data}) => {
          setTx(data[0])
          setLoading(false)
        })
        .catch(() => {
          dispatch(replace(`/${chainId}/inspect/404`, {type: 'TRANSACTION', search: hash}))
        })
    }
  }, [chainId, hash, updated, tx.sender, dispatch])

  const payload = useMemo(() => {
    return {
      type: tx.type,
      info: tx.info,
      ...JSON.parse(tx.payload)
    }
  }, [tx])

  return (
    <Grid
      item
      xs={12}
    >
      <Grid
        container
        spacing={0}
      >
        <InformationCard
          title="Tx information"
          columns={columns}
          data={tx}
          divider
          loading={loading}
        />
        <InformationCard
          columns={[
            ...payloadSpecificColumns,
            ...payloadColumns[tx.type]
          ]}
          data={payload}
          loading={loading}
        />
      </Grid>
    </Grid>
  )
}

export default Transaction
