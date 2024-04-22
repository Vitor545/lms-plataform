import { UserButton } from '@clerk/nextjs'
import { NextPage } from 'next'

interface Props {}

const Dashboard: NextPage<Props> = ({}) => {
  return <div>
    <UserButton afterSignOutUrl='/' />
  </div>
}

export default Dashboard