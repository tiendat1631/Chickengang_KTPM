// JavaScript file - no TypeScript checking
import Breadcrumb from '@/components/ui/Breadcrumb';

/**
 * CheckoutPage component demonstrating the new Breadcrumb component
 */
const CheckoutPage = () => {
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'The Dark Knight', href: '/movies/1' },
    { label: 'Chọn suất', href: '/movies/1/screenings' },
    { label: 'Chọn ghế', href: '/booking/1/screening/1' },
    { label: 'Thanh toán' } // Current page - no href
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with synced dark background */}
      <header className="bg-gradient-to-r from-purple-800 to-gray-800">
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Page title and subtitle */}
        <div className="max-w-6xl mx-auto px-3 py-6 md:px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
            Xác nhận đặt vé
          </h2>
          <p className="text-white text-base md:text-lg font-medium drop-shadow-md">
            Vui lòng kiểm tra lại thông tin trước khi thanh toán
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-3 py-8 md:px-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              Thông tin đặt vé
            </h3>
            <p className="text-gray-600 text-sm">
              Vui lòng kiểm tra lại thông tin trước khi thanh toán
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {/* Movie Information */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  🎬
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">The Dark Knight</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div><span className="font-medium">Suất chiếu:</span> 20:00 - 22:30</div>
                    <div><span className="font-medium">Phòng:</span> Phòng 3</div>
                    <div><span className="font-medium">Ngày:</span> Thứ Bảy, 20 tháng 1, 2024</div>
                    <div><span className="font-medium">Định dạng:</span> 3D</div>
                  </div>
                </div>
              </div>
              
              {/* Selected Seats */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Ghế đã chọn</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    F7 - Thường
                    <span className="ml-2 font-bold">120.000 ₫</span>
                  </span>
                </div>
              </div>
              
              {/* Payment Summary */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Tóm tắt thanh toán</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số ghế:</span>
                    <span className="font-medium">1 ghế</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giá vé:</span>
                    <span className="font-medium">120.000 ₫</span>
                  </div>
                  <div className="border-t border-green-300 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold text-green-700">
                      <span>Tổng cộng:</span>
                      <span>120.000 ₫</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                ← Quay lại
              </button>
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all transform hover:scale-105 shadow-lg">
                💳 Thanh toán ngay
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
