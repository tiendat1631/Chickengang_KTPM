// @ts-check
import PropTypes from 'prop-types';
import Breadcrumb from '@/components/ui/Breadcrumb';

/**
 * Demo page to test Breadcrumb component with different scenarios
 * @returns {JSX.Element}
 */
const BreadcrumbDemo = () => {
  const shortBreadcrumb = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Phim' }
  ];

  const mediumBreadcrumb = [
    { label: 'Trang chủ', href: '/' },
    { label: 'The Dark Knight', href: '/movies/3' },
    { label: 'Chọn suất' }
  ];

  const longBreadcrumb = [
    { label: 'Trang chủ', href: '/' },
    { label: 'The Dark Knight', href: '/movies/3' },
    { label: 'Chọn suất', href: '/movies/3/screenings' },
    { label: 'Chọn ghế', href: '/booking/3/screening/123' },
    { label: 'Thanh toán' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Short Breadcrumb */}
      <header className="bg-gradient-to-r from-purple-800 to-gray-800">
        <Breadcrumb items={shortBreadcrumb} />
        <div className="max-w-6xl mx-auto px-3 py-6 md:px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            Short Breadcrumb Demo
          </h2>
          <p className="text-white/90 text-base md:text-lg font-medium">
            Testing breadcrumb with 2 items
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 py-8 md:px-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Short Breadcrumb (≤3 items)
          </h3>
          <p className="text-gray-600 mb-4 text-lg">
            This breadcrumb has only 2 items, so it displays fully without truncation.
          </p>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-800 font-medium">
              ✅ All items visible • ✅ No truncation • ✅ Full path shown
            </p>
          </div>
        </div>
      </div>

      {/* Medium Breadcrumb */}
      <header className="bg-gradient-to-r from-purple-800 to-gray-800">
        <Breadcrumb items={mediumBreadcrumb} />
        <div className="max-w-6xl mx-auto px-3 py-6 md:px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            Medium Breadcrumb Demo
          </h2>
          <p className="text-white/90 text-base md:text-lg font-medium">
            Testing breadcrumb with 3 items
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 py-8 md:px-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Medium Breadcrumb (3 items)
          </h3>
          <p className="text-gray-600 mb-4 text-lg">
            This breadcrumb has 3 items, so it displays fully without truncation.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">
              ✅ All items visible • ✅ No truncation • ✅ Perfect for most pages
            </p>
          </div>
        </div>
      </div>

      {/* Long Breadcrumb */}
      <header className="bg-gradient-to-r from-purple-800 to-gray-800">
        <Breadcrumb items={longBreadcrumb} />
        <div className="max-w-6xl mx-auto px-3 py-6 md:px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            Long Breadcrumb Demo
          </h2>
          <p className="text-white/90 text-base md:text-lg font-medium">
            Testing breadcrumb with 5 items (full navigation)
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 py-8 md:px-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Long Breadcrumb (>3 items)
          </h3>
          <p className="text-gray-600 mb-4 text-lg">
            This breadcrumb has 5 items. On mobile (≤375px), it will show: "Trang chủ / ... / Thanh toán"
          </p>
          <p className="text-gray-600 mb-6 text-lg">
            On desktop, it shows all items: "Trang chủ / The Dark Knight / Chọn suất / Chọn ghế / Thanh toán"
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">📱 Mobile Behavior</h4>
              <p className="text-sm text-orange-700">
                Truncated display with ellipsis for better mobile UX
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">🖥️ Desktop Behavior</h4>
              <p className="text-sm text-purple-700">
                Full path display with all navigation items
              </p>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              ♿ Accessibility Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Proper ARIA labels and navigation structure
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Keyboard focus support with visible focus rings
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Screen reader friendly with aria-current="page"
                </li>
              </ul>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  High contrast mode support
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Reduced motion support
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Tooltip shows full path on hover
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbDemo;
