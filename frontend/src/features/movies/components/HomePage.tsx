import HeroSection from './HeroSection'
import MovieList from './MovieList'
import { useMovies } from '@/hooks/useMovies'

export default function HomePage() {
  const { data: moviesData, isLoading, error } = useMovies(0, 10)

  return (
    <div className="space-y-8">
      <HeroSection />
      <MovieList 
        movies={moviesData?.content || []}
        title="Phim đang chiếu"
        subtitle="Khám phá những bộ phim hay nhất hiện tại"
        loading={isLoading}
        error={error?.message}
      />
    </div>
  )
}

