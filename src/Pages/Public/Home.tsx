import CircleMenu from '../../Components/Home/CircleMenu'
import Hero from '../../Components/Home/Hero'
import { FeatureSection } from '../../Components/Home/Features'
import { StatsSection } from '../../Components/Home/Stats'
import { TestimonialSection } from '../../Components/Home/Testimonials'

function Home() {

  return (
    <>
      <Hero />
      <CircleMenu />
      <FeatureSection />
      <StatsSection />
      <TestimonialSection />
    </>
  )
}

export default Home
