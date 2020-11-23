import {useCallback, useEffect, useState} from "react"
import {AxiosError} from "axios"
import {useChainId} from "../reducer"
import ExplorerAPI from "../ExplorerAPI"

type useScrollUpdateReturn<T> = [
  T[], UseScrollLoading, (params: { scrollTop: number }) => void
]

export default function useScrollUpdate<T>(
  fetcher: (size: number, fixedHeight: number, chainId: string) => Promise<T[] | null>,
  ref: HTMLDivElement | undefined,
  fetchSize: number = 20
): useScrollUpdateReturn<T> {
  const [list, setList] = useState<T[]>([])
  const [loading, setLoading] = useState<UseScrollLoading>('READY')
  const chainId = useChainId()

  const [fixedHeight, setFixedHeight] = useState(-1)

  useEffect(() => {
    ExplorerAPI
      .fetchBlockchain(chainId, 1, 0)
      .then(({data}) => {
        setFixedHeight(data.last_height)
      })
  }, [chainId])

  const fetch = useCallback(() => {
    if (loading === 'READY') {
      setLoading('FETCH')
      fetcher(list.length, fixedHeight, chainId)
        .then((data) => {
          if (data === null) {
            return
          }

          setList([...list, ...data])
          if (data.length < fetchSize) {
            setLoading('DONE')
            return
          }

          setTimeout(() => {
            setLoading('READY')
          }, 300)
        })
        .catch((e: AxiosError) => {
          if (e.isAxiosError) {
            if (e.message.indexOf(('timeout')) !== -1) {
              setLoading('DONE')
              return
            }

            if (e.response?.status === 404) {
              setLoading('DONE')
              return
            }
          }

          setLoading('READY')
        })
    }
  }, [list, loading, fixedHeight, chainId, fetchSize, fetcher])

  const onScroll = useCallback((params: { scrollTop: number }) => {
    const height = 200 + document.documentElement.clientHeight + params.scrollTop + (ref?.clientHeight || 0)
    if ((height >= document.body.scrollHeight)) {
      fetch()
    }
  }, [fetch, ref])

  useEffect(() => {
    if (fixedHeight !== -1 && list.length === 0 && loading === 'READY') {
      fetch()
    }
  }, [fetch, list, loading, fixedHeight])

  return [list, loading, onScroll]
}
