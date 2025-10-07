import { useParams, Link } from 'react-router-dom'

export function MovieDetailPage() {
  const { id } = useParams()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-lg">Movie Poster</span>
            </div>
          </div>
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Movie Title {id}
            </h1>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Thông tin phim</h3>
                <p className="text-gray-600">
                  Đây là mô tả chi tiết về bộ phim. Phim kể về câu chuyện hấp dẫn với những tình tiết bất ngờ.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-700">Thể loại:</span>
                  <p className="text-gray-600">Action, Adventure</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Thời lượng:</span>
                  <p className="text-gray-600">2h 30m</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Đạo diễn:</span>
                  <p className="text-gray-600">Director Name</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Diễn viên:</span>
                  <p className="text-gray-600">Actor 1, Actor 2</p>
                </div>
              </div>
              <div className="pt-4">
                <Link
                  to={`/booking/${id}`}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 inline-block"
                >
                  Đặt vé ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

