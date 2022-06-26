import Head from 'next/head';
import Front from './user/Front';

export default function Home() {

  return (
    <div>
      <Head>
        <title>Account Book</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Front />
      </main>

      <footer>
        
      </footer>
    </div>
  )
}
