import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Stats } from "@/components/landing/stats"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Platforms } from "@/components/landing/platforms"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"
import { DashboardRedirect } from "@/components/dashboard-redirect"
import { Suspense } from "react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <DashboardRedirect />
      </Suspense>
      <Header />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Platforms />
      <CTA />
      <Footer />
    </main>
  )
}
