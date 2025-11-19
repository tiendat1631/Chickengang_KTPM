import apiClient from './api'

export const updatePaymentMethod = async (paymentId, payload) => {
  const response = await apiClient.patch(`/v1/payments/${paymentId}`, payload)
  return response.data?.data
}

export default {
  updatePaymentMethod
}

