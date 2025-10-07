import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Chào mừng đến với Movie Booking System
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Đặt vé xem phim dễ dàng và tiện lợi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample movie cards */}
        {[1, 2, 3, 4, 5, 6].map((movie) => (
          <div key={movie} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Movie Poster {movie}</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Movie Title {movie}
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Action, Adventure
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">2h 30m</span>
                <Link
                  to={`/movie/${movie}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

