// Movie Types
export interface Movie {
  id: number;
  title: string;
  director: string;
  actors: string;
  genres: string;
  releaseDate: string;
  duration: string;
  language: string;
  rated: string;
  description: string;
}

export interface MovieRequest {
  title: string;
  director: string;
  actors: string;
  genres: string;
  releaseDate: string;
  duration: string;
  language: string;
  rated: string;
  description: string;
}

export interface MovieResponse {
  id: number;
  title: string;
  director: string;
  actors: string;
  genres: string;
  releaseDate: string;
  duration: string;
  language: string;
  rated: string;
  description: string;
}

export interface PatchMovie {
  title?: string;
  director?: string;
  actors?: string;
  genres?: string;
  releaseDate?: string;
  duration?: string;
  language?: string;
  rated?: string;
  description?: string;
}

// Booking Types (for future implementation)
export interface Booking {
  id: number;
  userId: number;
  movieId: number;
  showtimeId: number;
  seatIds: number[];
  totalAmount: number;
  status: BookingStatus;
  bookingTime: string;
  paymentStatus: PaymentStatus;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}
