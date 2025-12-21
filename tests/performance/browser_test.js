import { browser } from 'k6/browser';
import { check } from 'k6';

export const options = {
    scenarios: {
        browser: {
            executor: 'constant-vus',
            exec: 'browserTest',
            vus: 10,             // Tăng lên 10 người truy cập CÙNG LÚC
            duration: '30s',
            options: {
                browser: {
                    type: 'chromium',
                },
            },
        },
    },
    thresholds: {
        checks: ['rate==1.0'],
        browser_web_vital_lcp: ['p(95) < 2500'],
    }
};

export async function browserTest() {
    // 1. CẤU HÌNH CHO DOCKER
    // Khi chạy trong Docker, chromium bắt buộc cần --no-sandbox để không bị crash
    const page = await browser.newPage({
        args: ['--no-sandbox', '--disable-setuid-sandbox'], 
    });

    // 2. XỬ LÝ URL
    // Trong docker-compose, bạn đã set BASE_URL=http://frontend
    // Frontend trong docker mở cổng 80 (nginx), không phải 3000 (đó là cổng host)
    const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

    try {
        // console.log(`Đang test tại: ${BASE_URL}`); // Uncomment để debug log
        await page.goto(BASE_URL);

        // 3. LOGIC TEST (Đã fix await)
        const headerLocator = page.locator('header'); // Hoặc selector phù hợp với app của bạn
        
        // Chờ tối đa 5s cho element xuất hiện (tránh fail ngay lập tức nếu mạng chậm)
        // await headerLocator.waitFor({ state: 'visible', timeout: 5000 }); 
        
        const isHeaderVisible = await headerLocator.isVisible();

        check(page, {
            'header is visible': isHeaderVisible,
        });

    } finally {
        await page.close();
    }
}
