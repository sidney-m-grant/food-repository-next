import React from "react"
import { useRouter } from 'next/router'
import Head from 'next/head'


const Home = () => {
  
  const router = useRouter()
  router.push('/signIn')

  return (
    <Head>
      <title>Food Repository</title>
    </Head>
  )
}

export default Home
