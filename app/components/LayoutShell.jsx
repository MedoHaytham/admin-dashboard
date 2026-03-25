'use client'
import Header from './header'
import Sidebar from './sidebar'
import Login from './login'
import LoadingCircle from './loadingCircle'
import { useGetMeQuery } from '../features/userSlice'

export default function LayoutShell({ children }) {
  const { data: meData, isLoading, isError } = useGetMeQuery()
  const isAuthenticated = !!meData?.data && !isError && meData?.data?.role !== 'user';

  if (isLoading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><LoadingCircle /></div>;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto w-full">
          <Header />
          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}