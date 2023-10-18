import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import { auth } from "../firebase";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);

  const init = async () => {
    await auth.authStateReady();
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return <div>{isLoading ? null : <Component {...pageProps} />}</div>;
}
