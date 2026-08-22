import { Header } from "@/components/layout/header";
import { Hero } from "@/components/home/hero";
import { NowShowing } from "@/components/home/now-showing";
import { getEvents } from "@/services/events";
import { Journey } from "@/components/home/journey";
import { Footer } from "@/components/layout/footer";

export default async function Home() {
  const events = await getEvents();

  return (
    <>
      <Header />

      <main>
        <Hero />

        <NowShowing events={events} />

        <Journey />
      </main>

    <Footer />
    </>
  );
}