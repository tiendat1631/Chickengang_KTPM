import apiClient from './api'

export const cancelBooking = async (bookingId) => {
  const response = await apiClient.patch(`/v1/bookings/${bookingId}/cancel`)
  return response.data?.data
}

export default {
  cancelBooking
}

