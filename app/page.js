'use client'
import Overview from "./overview/page"
import Login from "./components/login"
import { useGetMeQuery } from './features/userSlice';
import LoadingCircle from "./components/loadingCircle";


export default function Home() {
  const { data: meData, isLoading, isError } = useGetMeQuery();
  
  const isAuthenticated = !!meData?.data && !isError && meData?.data?.role !== 'user';

  if (isLoading) {
    return <div style={{ height: 'calc(100vh - 137px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><LoadingCircle /></div>;
  }

  return isAuthenticated ? <Overview /> : <Login />
}