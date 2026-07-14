import { cn } from '@/lib/utils'
import React from 'react'
interface Props {
  isAbsolute?: boolean
}
const Separtor: React.FC<Props> = ({ isAbsolute = false }) => (
  <hr className={cn('inset-x-0 m-0 mx-auto h-2 max-w-480 border-0 bg-[#F2F3F4]', isAbsolute && 'absolute mt-3')} />
)

export default Separtor
