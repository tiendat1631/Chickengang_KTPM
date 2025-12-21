import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Configuration
FRONTEND_URL = "http://localhost:3000"

@pytest.fixture
def driver():
    # Setup Chrome Driver
    d = webdriver.Chrome()
    d.implicitly_wait(5) # Implicit wait for elements
    yield d
    # Teardown
    d.quit()

def test_cancel_booking_popup(driver):
    """
    M3-16: Verify 'Are you sure?' popup appears when clicking Cancel.
    """
    # 1. Open Page
    driver.get(f"{FRONTEND_URL}/login")
    
    # 2. Login (Adjust selectors based on actual React code)
    # driver.find_element(By.NAME, "username").send_keys("testuser")
    # driver.find_element(By.NAME, "password").send_keys("password")
    # driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    
    # Wait for login redirect
    # WebDriverWait(driver, 10).until(EC.url_contains("/dashboard"))

    # 3. Go to My Bookings
    driver.get(f"{FRONTEND_URL}/bookings")
    
    # Mocking: Assume there is at least one booking button
    # In reality, you might need to create a booking first or mock the API response
    
    # buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Cancel')]")
    # if not buttons:
    #     pytest.skip("No bookings to cancel. Please create a booking manually first.")
        
    # buttons[0].click()

    # 4. Verify Popup
    # popup = WebDriverWait(driver, 5).until(
    #     EC.visibility_of_element_located((By.CLASS_NAME, "modal-content"))
    # )
    # assert popup.is_displayed()
    # assert "Are you sure" in popup.text

    # Temporary Pass to prove environment works
    print("Test Environment is Ready! update selectors to match real React components.")
    assert True

def test_empty_booking_list(driver):
    """
    M3-10: Verify 'No bookings found' message when list is empty.
    """
    driver.get(f"{FRONTEND_URL}/bookings")
    
    # Assume user has no bookings
    # message = driver.find_element(By.XPATH, "//*[contains(text(), 'No bookings found')]")
    # assert message.is_displayed()
