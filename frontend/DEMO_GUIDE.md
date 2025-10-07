# 🎬 Demo Frontend - Hello World (React Web)

## Mô tả
Đây là demo frontend React.js đơn giản với TypeScript cho web desktop để kiểm tra cấu hình và môi trường phát triển.

## Tính năng demo
- ✅ Hello World component với UI đẹp
- ✅ TypeScript strict mode
- ✅ React web components với CSS styling
- ✅ Alert dialog khi nhấn button
- ✅ Responsive design cho desktop
- ✅ Gradient background và modern UI
- ✅ Webpack bundling và hot reload

## Cách chạy demo

### 1. Cài đặt dependencies (đã hoàn thành)
```bash
cd frontend
npm install --legacy-peer-deps
```

### 2. Chạy development server
```bash
npm start
# hoặc
npm run dev
```

### 3. Build production
```bash
npm run build
```

## Cấu trúc file demo
```
frontend/
├── App.tsx              # Component chính với Hello World
├── App.css              # CSS styling cho component
├── index.js             # Entry point của ứng dụng React
├── index.html            # HTML template
├── webpack.config.js    # Webpack bundler config
├── babel.config.js      # Babel config với path aliases
├── .eslintrc.js         # ESLint config cho React web
├── .prettierrc.js       # Prettier config
└── package.json         # Dependencies và scripts
```

## Kiểm tra
- [ ] Webpack dev server chạy thành công trên port 3000
- [ ] App hiển thị "Hello World" trên browser
- [ ] Button hoạt động và hiển thị alert
- [ ] UI responsive và đẹp mắt
- [ ] Không có lỗi TypeScript/ESLint
- [ ] Hot reload hoạt động khi edit code

## Troubleshooting
1. **Port 3000 bị chiếm**: Webpack sẽ tự động tìm port khác
2. **Build fail**: Kiểm tra TypeScript và Babel config
3. **CSS không load**: Kiểm tra webpack CSS loader config

## Next Steps
Sau khi demo chạy thành công, có thể tiếp tục phát triển:
- Thêm React Router cho navigation
- Tích hợp API với TanStack Query
- Thêm authentication flow
- Implement movie booking features
- Thêm responsive design cho mobile
