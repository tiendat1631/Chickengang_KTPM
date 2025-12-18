import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

FRONTEND_URL = "http://localhost:3000"

@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    # options.add_argument('--headless')
    # Disable Chrome Password Manager popups
    options.add_experimental_option("prefs", {
        "credentials_enable_service": False,
        "profile.password_manager_enabled": False
    })
    options.add_argument("--disable-save-password-bubble")
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(10)
    driver.maximize_window()
    yield driver
    driver.quit()

def test_e2e_cancel_booking(driver):
    """
    M3-30 & M3-39: View History and Cancel Booking
    1. Login
    2. Create a new Booking (Prerequisite)
    3. Go to 'My Tickets'
    4. Select the booking
    5. Click 'Cancel Booking'
    6. Verify status updates to 'Cancelled'
    """
    try:
        # --- 1. LOGIN ---
        print("--- Step 1: Login ---")
        driver.get(f"{FRONTEND_URL}/login")
        driver.find_element(By.ID, "username").send_keys("johndoe")
        driver.find_element(By.ID, "password").send_keys("password")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        WebDriverWait(driver, 10).until(EC.url_to_be(f"{FRONTEND_URL}/"))
        
        # --- 2. CREATE BOOKING (Fast Forward) ---
        print("--- Step 2: Create Booking ---")
        # Go to a movie screening directly if possible, or click through
        # Clicking first movie
        buy_buttons = driver.find_elements(By.CLASS_NAME, "movie-card__cta-button")
        driver.execute_script("arguments[0].click();", buy_buttons[0])
        
        # Select screening
        WebDriverWait(driver, 10).until(EC.url_contains("/screenings"))
        time_slot = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'cursor-pointer') and .//span[contains(text(), 'Có vé')]]")) 
        )
        driver.execute_script("arguments[0].click();", time_slot)
        
        # Select seat
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "seat-selection-page")))
        available_seats = driver.find_elements(By.CSS_SELECTOR, ".seat.available")
        if not available_seats:
            pytest.skip("No seats available to book for cancellation test.")
        
        driver.execute_script("arguments[0].click();", available_seats[0])
        
        # Continue
        continue_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Tiếp tục đặt vé')]")
        WebDriverWait(driver, 5).until(lambda d: continue_btn.is_enabled())
        driver.execute_script("arguments[0].click();", continue_btn)
        
        # Confirm
        WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//h1[contains(text(), 'Xác nhận đặt vé')]")))
        payment_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Thanh toán')]")
        driver.execute_script("arguments[0].click();", payment_btn)
        
        # Wait for Payment Page (Booking is created PENDING here)
        WebDriverWait(driver, 10).until(EC.url_contains("/payment"))
        print("Booking created successfully (Status: PENDING).")
        
        # --- 3. GO TO MY TICKETS ---
        print("--- Step 3: Go to My Tickets ---")
        # Click User Dropdown/Avatar then My Tickets? Or direct link?
        # Looking at Header.jsx might be needed, but usually there's a link or we can navigate directly.
        driver.get(f"{FRONTEND_URL}/my-tickets")
        
        # Wait for list to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h3[contains(text(), 'Danh sách đặt chỗ')]"))
        )
        print(f"On My Tickets Page: {driver.current_url}")
        
        # --- 4. SELECT BOOKING ---
        print("--- Step 4: Select the first booking ---")
        # The list items are clickable divs. Let's click the first one.
        # Based on MyTicketsPage.jsx: onClick={() => handleBookingClick(booking)}
        # It has class 'border-gray-200' or 'border-blue-500' if selected.
        # We need to find the list items. They are inside "space-y-4" container.
        # Let's verify we have bookings
        bookings = driver.find_elements(By.XPATH, "//div[contains(@class, 'cursor-pointer') and .//div[contains(text(), 'Chi tiết')]]")
        if not bookings:
             pytest.fail("No bookings found in My Tickets list!")
             
        bookings[0].click()
        print("Selected first booking.")
        
        # --- 5. CANCEL BOOKING ---
        print("--- Step 5: Cancel Booking ---")
        # Wait for Details panel to show "Đang chờ duyệt" or "Hủy đặt vé" button.
        cancel_btn = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Hủy đặt vé')]"))
        )
        driver.execute_script("arguments[0].click();", cancel_btn)
        
        # Confirm Alert
        print("Handling confirmation alert...")
        WebDriverWait(driver, 5).until(EC.alert_is_present())
        driver.switch_to.alert.accept()
        print("Accepted cancellation alert.")
        
        # --- 6. VERIFY STATUS ---
        print("--- Step 6: Verify Status Update ---")
        # Wait for status badge to become "Đã hủy" (CANCELLED)
        # The badge is in the details view or list view.
        # Badge class: bg-red-100 text-red-800 for CANCELLED
        
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//span[contains(text(), 'Đã hủy')]"))
        )
        print("M3-30/39 Verified: Booking status changed to 'Đã hủy'.")
        
    except Exception as e:
        print(f"TEST FAILED at URL: {driver.current_url}")
        driver.save_screenshot("e2e_cancel_error.png")
        raise e
