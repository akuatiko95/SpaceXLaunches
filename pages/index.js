import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export default function Home({ launches }) {
  console.log("launches", launches);
  return (
    <div className={styles.container}>
      <Head>
        <title>SpaceX Launches App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>SpaceX Launches</h1>

        <p className={styles.description}>
          <a href="https://www.spacex.com/launches/">Latest launches</a> from
          SpaceX
        </p>

        <div className={styles.grid}>
          {launches.map((launch) => {
            return (
              <a
                key={launch.id}
                href={launch.links.video_link}
                className={styles.card}
              >
                <h3>{launch.mission_name}</h3>
                <p>
                  <strong>Launch Date:</strong>{" "}
                  {new Date(launch.launch_date_local).toLocaleDateString(
                    "en-US"
                  )}
                </p>
              </a>
            );
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://api.spacex.land/graphql/",
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 10) {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
      }
    `,
  });
  //console.log("data", data); //this run in node (see in terminal)
  return {
    props: {
      launches: data.launchesPast,
    },
  };
}
