import { HeroSection } from './HeroSection'
import { MovieList } from './MovieList'

export function HomePage() {
  return (
    <div className="space-y-8">
      <HeroSection />
      <MovieList />
    </div>
  )
}

