import { useSearchParams } from 'react-router-dom'
import { PROBLEMS_PUBLISHED } from '../data/problems'

// 題目是否已公布。正式站以 data/problems.ts 的 PROBLEMS_PUBLISHED 為準；
// 網址加 ?published=1（已公開）或 ?published=0（未公開）可暫時覆寫，
// 方便不改程式碼就預覽兩種版本。
export function useProblemsPublished(): boolean {
  const [searchParams] = useSearchParams()
  const override = searchParams.get('published')
  if (override === '1') return true
  if (override === '0') return false
  return PROBLEMS_PUBLISHED
}
