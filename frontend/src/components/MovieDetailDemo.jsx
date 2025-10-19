import PropTypes from 'prop-types';
import MovieHero from './ui/MovieHero.jsx';

/**
 * Movie Detail Demo Page showcasing the polished MovieHero component
 * @returns {JSX.Element}
 */
const MovieDetailDemo = () => {
  // Sample movie data
  const movieData = {
    title: "The Dark Knight",
    overview: "Khi Joker gây ra hỗn loạn và hủy diệt ở Gotham City, Batman phải chấp nhận một trong những thử thách tâm lý và thể chất lớn nhất trong khả năng của mình để đối đầu với kẻ thù không thể đoán trước.",
    director: "Christopher Nolan",
    duration: "152 phút",
    releaseDate: "18 tháng 7, 2008",
    genres: ["Action", "Crime", "Drama"],
    posterUrl: null, // Will use placeholder
    rating: "T16",
    isFeatured: true
  };

  // Breadcrumb navigation
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Phim', href: '/movies' },
    { label: 'The Dark Knight' }
  ];

  // Event handlers
  const handleWatchTrailer = () => {
    console.log('Watching trailer for The Dark Knight');
    // Implement trailer functionality
  };

  const handleBuyTickets = () => {
    console.log('Buying tickets for The Dark Knight');
    // Implement ticket purchase functionality
  };

  return (
    <div className="min-h-screen">
      <MovieHero
        movie={movieData}
        breadcrumbItems={breadcrumbItems}
        onWatchTrailer={handleWatchTrailer}
        onBuyTickets={handleBuyTickets}
      />
      
      {/* Additional content to demonstrate scrolling */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Thông tin bổ sung
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Đánh giá phim
              </h3>
              <p className="text-gray-600 leading-relaxed">
                The Dark Knight được đánh giá là một trong những bộ phim siêu anh hùng hay nhất mọi thời đại, 
                với diễn xuất xuất sắc của Heath Ledger trong vai Joker.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Thông tin kỹ thuật
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Định dạng: IMAX, 35mm</li>
                <li>• Tỷ lệ khung hình: 2.35:1</li>
                <li>• Ngôn ngữ: Tiếng Anh</li>
                <li>• Phụ đề: Tiếng Việt</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailDemo;
