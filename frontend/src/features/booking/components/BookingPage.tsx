import { useParams, Link } from 'react-router-dom'

export function BookingPage() {
  const { movieId } = useParams()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Đặt vé xem phim
        </h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Chọn suất chiếu
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['10:00', '13:00', '16:00', '19:00'].map((time) => (
                <button
                  key={time}
                  className="p-3 border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-500 text-center"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Chọn ghế
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="grid grid-cols-8 gap-2 mb-4">
                {Array.from({ length: 48 }, (_, i) => (
                  <button
                    key={i}
                    className={`w-8 h-8 rounded text-xs ${
                      i % 8 === 0 || i % 8 === 7
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                    disabled={i % 8 === 0 || i % 8 === 7}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="flex justify-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span>Có thể chọn</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
                  <span>Không có</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Thông tin đặt vé
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span>Phim:</span>
                <span className="font-medium">Movie Title {movieId}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Suất chiếu:</span>
                <span className="font-medium">19:00</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Số ghế:</span>
                <span className="font-medium">A1, A2</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Tổng tiền:</span>
                <span className="text-blue-600">200,000 VNĐ</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Link
              to={`/movie/${movieId}`}
              className="bg-gray-500 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-600"
            >
              Quay lại
            </Link>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700">
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
