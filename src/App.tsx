import Navbar from './Components/Layout/Navbar'
import CircleMenu from './Components/Home/CircleMenu'
import Hero from './Components/Home/Hero'
import { FeatureSection } from './Components/Home/Features'
import { StatsSection } from './Components/Home/Stats'
import { TestimonialSection } from './Components/Home/Testimonials'
import { Footer } from './Components/Layout/Footer'

function App() {

  return (
    <>
      <Navbar />
      <Hero />
      <CircleMenu />
      <FeatureSection />
      <StatsSection />
      <TestimonialSection />
      <Footer />
    </>
  )
}

export default App
