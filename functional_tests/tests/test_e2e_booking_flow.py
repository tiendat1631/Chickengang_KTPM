import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Configuration
FRONTEND_URL = "http://localhost:3000"

@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    # options.add_argument('--headless') # Uncomment to run headless
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(10)
    yield driver
    driver.quit()

def test_e2e_booking_flow(driver):
    """
    M3-01: End-to-End Booking Flow
    1. Login
    2. Select Movie
    3. Select Seat
    4. Confirm Booking
    5. Make Payment
    6. Verify Success
    """
    try:
        # --- 1. LOGIN ---
        print(f"Navigating to: {FRONTEND_URL}/login")
        driver.get(f"{FRONTEND_URL}/login")
        
        # Enter Username
        driver.find_element(By.ID, "username").clear()
        driver.find_element(By.ID, "username").send_keys("johndoe") 
        
        # Enter Password
        driver.find_element(By.ID, "password").clear()
        driver.find_element(By.ID, "password").send_keys("password")
        
        # Click Login
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        # Wait for Redirect to Home
        print("Waiting for redirect to Home...")
        WebDriverWait(driver, 10).until(
            EC.url_to_be(f"{FRONTEND_URL}/")
        )
        print(f"Login Successful! Current URL: {driver.current_url}")
        time.sleep(2) # Wait for toasts to clear

        # --- 2. SELECT MOVIE ---
        buy_buttons = driver.find_elements(By.CLASS_NAME, "movie-card__cta-button")
        if not buy_buttons:
            pytest.skip("No movies found on Homepage. Cannot proceed.")
        
        print("Clicking first movie 'Mua Ve' button...")
        driver.execute_script("arguments[0].click();", buy_buttons[0])

        # Wait for Screenings Page
        print("Waiting for Screenings Page...")
        WebDriverWait(driver, 10).until(
            EC.url_contains("/screenings")
        )
        print(f"On Screenings Page: {driver.current_url}")

        # Select the first ACTIVE screening
        # Wait for screenings to load
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Chọn suất chiếu')]"))
        )
        
        # Find clickable screening card
        time_slot = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'cursor-pointer') and .//span[contains(text(), 'Có vé')]]")) 
        )
        print("Clicking screening time slot...")
        # Use JS click to be safe
        driver.execute_script("arguments[0].click();", time_slot)
        
        # --- 3. SELECT SEAT ---
        print("Waiting for Seat Selection Page...")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "seat-selection-page"))
        )
        print(f"On Seat Selection Page: {driver.current_url}")
        
        # Find an available seat
        available_seats = driver.find_elements(By.CSS_SELECTOR, ".seat.available")
        if not available_seats:
            pytest.fail("No available seats found for this screening.")
        
        # Click the first available seat
        seat = available_seats[0]
        driver.execute_script("arguments[0].click();", seat)
        
        # Verify seat is selected
        print("Verifying seat selection...")
        WebDriverWait(driver, 5).until(
            lambda d: "selected" in seat.get_attribute("class")
        )
        print("Seat selected successfully.")
        
        # Click "Tiếp tục đặt vé"
        continue_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Tiếp tục đặt vé')]")
        
        # Wait for button to be enabled
        WebDriverWait(driver, 5).until(
            lambda d: continue_btn.is_enabled()
        )
        
        print("Clicking Continue button...")
        driver.execute_script("arguments[0].click();", continue_btn)

        # --- 4. CONFIRM BOOKING ---
        print("Waiting for Booking Confirmation Page...")
        # Wait for "Xác nhận đặt vé" header explicitly, as URL /booking/ overlaps with previous page
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//h1[contains(text(), 'Xác nhận đặt vé')]"))
        )
        print(f"On Booking Confirmation Page: {driver.current_url}")
        
        # Click "Thanh toán"
        payment_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Thanh toán')]")
        driver.execute_script("arguments[0].click();", payment_btn)

        # --- 5. MAKE PAYMENT ---
        print("Waiting for Payment Page...")
        WebDriverWait(driver, 10).until(
            EC.url_contains("/payment")
        )
        
        # Click "Xác nhận thanh toán"
        confirm_payment_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Xác nhận thanh toán')]")
        driver.execute_script("arguments[0].click();", confirm_payment_btn)

        # --- 6. VERIFY SUCCESS ---
        print("Waiting for Success Page...")
        WebDriverWait(driver, 15).until(
            EC.url_contains("/booking/success")
        )
        
        success_msg = driver.find_element(By.XPATH, "//*[contains(text(), 'Đặt vé thành công') or contains(text(), 'hành công')]")
        assert success_msg.is_displayed()
        print("M3-01 E2E Flow Passed!")

    except Exception as e:
        print(f"TEST FAILED at URL: {driver.current_url}")
        driver.save_screenshot("e2e_error.png")
        print("Screenshot saved to e2e_error.png")
        # Print page source snippet to debug
        # print("Page Source Snippet:", driver.page_source[:500]) 
        raise e
    

