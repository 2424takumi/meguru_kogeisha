import AreaGrid from "@/components/home/AreaGrid"
import WeeklyVote from "@/components/home/WeeklyVote"
import AboutMeguruSection from "@/components/home/AboutMeguruSection"
import SiteFooter from "@/components/layout/SiteFooter"
import SiteHeader from "@/components/layout/SiteHeader"
import { craftAreas, weeklyVote } from "@/data/home"

export default function Home() {
  return (

    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <SiteHeader />
      <main className="flex flex-col gap-20 pb-20">
        <div className="bg-gradient-to-b from-white via-white to-neutral-50 pb-12 pt-10">
          <WeeklyVote {...weeklyVote} />
        </div>
        <AreaGrid areas={craftAreas} />
        <AboutMeguruSection />
      </main>
      <SiteFooter />
    </div>
  )
}
