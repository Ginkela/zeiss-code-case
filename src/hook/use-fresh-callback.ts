import { useEffect, useRef, useState } from 'react'

/**
 *  解决function component回调中State为初始化状态的问题
 */
const useFreshCallback = ({ init, callback }: { init?: (args?: any) => void; callback: (args?: any) => void }) => {
  const [updateCounter, setUpdateCounter] = useState(0)
  const argsRef = useRef([])

  const freshCallback = (...args: any) => {
    argsRef.current = args
    setUpdateCounter(prevCount => prevCount + 1)
  }

  useEffect(() => {
    if (!updateCounter) return
    callback(...argsRef.current)
  }, [updateCounter])

  useEffect(() => {
    init && init()
  }, [])

  return { freshCallback }
}

export default useFreshCallback
