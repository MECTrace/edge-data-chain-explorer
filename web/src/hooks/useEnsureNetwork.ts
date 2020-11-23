import {useEffect} from 'react'
import {RootState, useUpdateState} from "../reducer"
import {useSelector} from "react-redux"

const useEnsureNetwork = (fn: (chainId: string) => void) => {
  const {chainId, updated} = useUpdateState()
  const path = useSelector<RootState, string>(state => state.router.location.pathname)

  useEffect(() => {
    const [, pathChainId] = path.split('/')
    if (pathChainId === chainId && updated) {
      fn(chainId)
    }

  }, [chainId, updated, path, fn])

}

export default useEnsureNetwork
