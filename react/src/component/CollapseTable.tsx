import React from 'react'
import {
  CircularProgress,
  Grid,
  Grow,
  Hidden,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useMediaQuery
} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import {useChainId} from "../reducer"

const useStyle = makeStyles((theme) => ({
  mobileTableCell: {
    display: 'flex',
    minHeight: '36px',
    lineHeight: '36px',
    padding: '4px 16px',
    height: '100%',
    justifyContent: 'space-between',
    alignContent: 'center',
    borderBottom: 'none'
  },
  mobileTableCellHeader: {
    fontWeight: 600,
  },
  mobileTableCellBody: {
    maxWidth: '55vw',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block'
  },
  mobileTableRow: {
    '& td:last-child': {
      borderBottom: '1px solid rgba(224, 224, 224, 1)'
    },
    display: 'inline'
  },
  emptyCell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
  title: {
    color: theme.palette.text.secondary,
    margin: '10px 15px',
    fontSize: '22px',
    textAlign: 'left'
  }
}))

export interface CollapsedTableColumn<T> {
  key: string,
  header?: React.ReactNode,
  format?: (v: any, chainId: string, rowData: T) => React.ReactNode
}

type Props<T extends Record<string, any>> = {
  dataSource: T[],
  columns: CollapsedTableColumn<T>[]
  rowKey: keyof T
  maxHeight?: string
  pagination?: {
    count: number,
    page: number,
    rowsPerPage: number,
    onChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void
  },
  fallbackText: string,
  loading?: boolean,
  elevation?: number,
}

function CollapseTable<T extends Record<string, any>>(props: Props<T>) {
  const classes = useStyle()
  const isMobile = useMediaQuery('(max-width: 1280px)')
  const chainId = useChainId()

  const {
    dataSource,
    columns,
    rowKey,
    maxHeight,
    pagination,
    fallbackText,
  } = props

  const elevation = typeof props.elevation === 'number' ? props.elevation : 3

  const containerStyle = {
    maxHeight
  }

  const Pagination = pagination && (
    <TablePagination
      {...pagination!}
      rowsPerPageOptions={[pagination!.rowsPerPage]}
      onChangeRowsPerPage={() => {
      }}
      component="div"
    />
  )

  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={12}
      lg={12}
    >
      <Paper elevation={elevation}>
        {Pagination}
        <TableContainer style={containerStyle}>
          <Table>
            <Hidden only={['xs', 'sm', 'md']}>
              <TableHead
                component="thead"
              >
                <tr>
                  {
                    columns.map((c, i) => (
                      <TableCell key={c.key} align="center">
                        {c.header || c.key.toUpperCase()}
                      </TableCell>
                    ))
                  }
                </tr>
              </TableHead>
            </Hidden>
            <TableBody>
              {
                dataSource.map((v, i) => (
                  <Grow
                    key={v[rowKey]}
                    in={true}
                    timeout={50 * (dataSource.length - i)}
                    style={{transformOrigin: 'top'}}
                  >
                    <TableRow className={isMobile ? classes.mobileTableRow : ''}>
                      {columns.map((c) => {
                        const value = c.format ? c.format(v[c.key], chainId, v) : v[c.key]

                        return (
                          <TableCell key={c.key} align="center" className={isMobile ? classes.mobileTableCell : ''}>
                            <Hidden only={['xs', 'sm', 'md']}>
                              {value}
                            </Hidden>
                            <Hidden only={['lg', 'xl']}>
                              <div className={isMobile ? classes.mobileTableCellHeader : ''}>
                                {c.header || c.key.toUpperCase()}
                              </div>
                              <div className={isMobile ? classes.mobileTableCellBody : ''}>
                                {value}
                              </div>
                            </Hidden>
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  </Grow>
                ))
              }
              {
                dataSource.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <div className={classes.emptyCell}>
                        {
                          props.loading ? (
                            <CircularProgress/>
                          ) : (
                            <h3>
                              {fallbackText}
                            </h3>
                          )
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
        {Pagination}
      </Paper>
    </Grid>
  )
}

export default CollapseTable
