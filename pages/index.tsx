import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/SignIn");
  }, []);

  return (
    <Head>
      <title>Food Repository</title>
    </Head>
  );
};

export default Home;
