'use client'
import Header from './header'
import Sidebar from './sidebar'
import { useGetMeQuery } from '../features/userSlice'

export default function LayoutShell({ children }) {
  const { data: meData, isError } = useGetMeQuery()
  const isAuthenticated = !!meData?.data && !isError && meData?.data?.role !== 'user';

  return (
    <div className="flex h-screen overflow-hidden">
      {isAuthenticated && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto w-full">
          {isAuthenticated && <Header />}
          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}