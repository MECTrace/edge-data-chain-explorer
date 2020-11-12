import React from 'react'
import StatCard from "./StatCard"
import {CollapsedTableColumn} from "./CollapseTable"
import {makeStyles, Theme} from "@material-ui/core/styles"
import {useChainId} from "../reducer"
import Skeleton from "@material-ui/lab/Skeleton"

const useStyle = makeStyles((theme: Theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '10px',
    fontSize: '14px',
    wordBreak: 'break-all',
    [theme.breakpoints.down('lg')]: {
      flexDirection: 'column'
    }
  },
  header: {
    width: '240px',
    fontWeight: 600
  },
  body: {
    flex: '1 1 auto'
  },
  loading: {
    width: '60%'
  }
}))

type InformationCardProps<T extends StringMap> = {
  title?: React.ReactNode,
  divider?: boolean
  columns: CollapsedTableColumn<T>[],
  data: T,
  loading?: boolean
  setRef?: (instance?: HTMLDivElement) => void
}

const InformationCard = function <T extends StringMap>(props: InformationCardProps<T>) {
  const classes = useStyle()
  const chainId = useChainId()

  const {
    title,
    columns,
    data,
    divider,
    loading,
    setRef
  } = props

  return (
    <StatCard
      title={title}
      size="large"
      titleAlign="left"
      bodyAlign="left"
      divider={divider}
      setRef={setRef}
    >
      {
        loading ? (
          <div className={classes.loading}>
            {columns.map((v, i) => <Skeleton key={i} animation="wave"/>)}
          </div>
        ) : (
          columns.map((c, i) => {
            const value = c.format ? c.format(data[c.key], chainId, data) : data[c.key]

            return (
              <div className={classes.wrapper} key={c.key}>
                <div className={classes.header}>
                  {c.header}
                </div>
                <div className={classes.body}>
                  {value}
                </div>
              </div>
            )
          })
        )
      }
    </StatCard>
  )
}

export default InformationCard
