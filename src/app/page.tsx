import AreaGrid from "@/components/home/AreaGrid"
import WeeklyVote from "@/components/home/WeeklyVote"
import AboutMeguruSection from "@/components/home/AboutMeguruSection"
import SiteFooter from "@/components/layout/SiteFooter"
import { craftAreas, weeklyVote } from "@/data/home"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <main className="flex flex-col gap-6 pb-12">
        <div className="bg-white pb-6 pt-6">
          <WeeklyVote {...weeklyVote} />
        </div>
        <AreaGrid areas={craftAreas} />
        <AboutMeguruSection />
      </main>
      <SiteFooter />
    </div>
  )
}
