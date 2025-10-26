import AreaGrid from "@/components/home/AreaGrid"
import WeeklyVote from "@/components/home/WeeklyVote"
import AboutMeguruSection from "@/components/home/AboutMeguruSection"
import SiteFooter from "@/components/layout/SiteFooter"
import { craftAreas, weeklyVote } from "@/data/home"

export default function Home() {
  return (
    <div className="flex flex-col bg-[--neu-50]">
      <section className="border-b border-[--neu-200] bg-white/80">
        <div className="mx-auto w-full max-w-[72rem] px-4 py-12 sm:px-6 lg:px-8">
          <WeeklyVote {...weeklyVote} />
        </div>
      </section>
      <div className="flex flex-col gap-24 pb-24 pt-16">
        <AreaGrid areas={craftAreas} />
        <AboutMeguruSection />
      </div>
      <SiteFooter />
    </div>
  )
}
