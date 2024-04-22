import { NextPage } from 'next'

interface Props {
    children: React.ReactNode
}

const AuthLayout: NextPage<Props> = ({children}) => {
  return <div className='h-full flex items-center justify-center'>
{children}
  </div>
}

export default AuthLayout