package com.example.movie.service;

import com.example.movie.dto.booking.BookingResponse;
import com.example.movie.dto.booking.CreateBookingRequest;
import com.example.movie.exception.AuthenticationRequiredException;
import com.example.movie.exception.InvalidId;
import com.example.movie.mapper.BookingMapper;
import com.example.movie.model.*;
import com.example.movie.repository.*;
import com.example.movie.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private BookingMapper bookingMapper;
    @Mock
    private ScreeningRepository screeningRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SeatRepository seatRepository;
    @Mock
    private TicketRepository ticketRepository;
    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private User user;
    private Screening screening;
    private Seat seat;
    private CreateBookingRequest createRequest;

    @BeforeEach
    void setUp() {
        // Setup Security Context
        SecurityContextHolder.setContext(securityContext);

        user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        screening = new Screening();
        screening.setId(10L);
        screening.setMovie(new Movie());
        screening.setAuditorium(new Auditorium());

        seat = new Seat();
        seat.setId(100L);
        seat.setRowLabel("A");
        seat.setNumber(1);

        createRequest = new CreateBookingRequest();
        createRequest.setScreeningId(10L);
        createRequest.setSeatIds(List.of(100L));
        createRequest.setTotalPrice(100000.0f);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void createBooking_Success() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("testuser");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(screeningRepository.findById(10L)).thenReturn(Optional.of(screening));
        when(seatRepository.findAllById(any())).thenReturn(List.of(seat));
        when(ticketRepository.findByScreeningIdAndSeatId(10L, 100L)).thenReturn(null);

        Booking savedBooking = new Booking();
        savedBooking.setId(555L);
        when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

        BookingResponse response = new BookingResponse();
        response.setId(555L);
        when(bookingMapper.toResponse(any(Booking.class))).thenReturn(response);

        // Act
        BookingResponse result = bookingService.createBooking(createRequest);

        // Assert
        assertNotNull(result);
        verify(bookingRepository, times(1)).save(any(Booking.class));
        verify(ticketRepository, times(1)).save(any(Ticket.class));
    }

    @Test
    void createBooking_NotAuthenticated_ThrowsException() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(null);

        // Act & Assert
        assertThrows(AuthenticationRequiredException.class, () -> bookingService.createBooking(createRequest));
    }

    @Test
    void cancelBooking_Success() {
        // Arrange
        Long bookingId = 555L;

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("testuser");

        Booking booking = new Booking();
        booking.setId(bookingId);
        booking.setBookingStatus(Booking.BookingStatus.PENDING);
        booking.setUser(user);
        booking.setScreening(screening);

        Payment payment = new Payment();
        payment.setStatus(Payment.PaymentStatus.PENDING);

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(paymentRepository.findByBookingId(bookingId)).thenReturn(Optional.of(payment));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);
        when(bookingMapper.toResponse(any(Booking.class))).thenReturn(new BookingResponse());

        // Act
        bookingService.cancelBooking(bookingId);

        // Assert
        assertEquals(Booking.BookingStatus.CANCELLED, booking.getBookingStatus());
        assertEquals(Payment.PaymentStatus.CANCELLED, payment.getStatus());
        verify(bookingRepository, times(1)).save(booking);
    }

    @Test
    void shouldReturnUserBookings_WhenAuthenticated() {
        // Arrange
        Booking booking = new Booking();
        booking.setId(1L);
        booking.setUser(user);

        when(bookingRepository.findByUserIdWithDetails(user.getId())).thenReturn(List.of(booking));
        when(bookingMapper.toResponse(any(Booking.class))).thenReturn(new BookingResponse());

        // Act
        List<BookingResponse> results = bookingService.getBookingsByUserId(user.getId());

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        verify(bookingRepository, times(1)).findByUserIdWithDetails(user.getId());
    }

    @Test
    void shouldThrowException_WhenCancellingConfirmedBooking() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("testuser");

        Booking booking = new Booking();
        booking.setId(1L);
        booking.setBookingStatus(Booking.BookingStatus.PAID); // PAID status (Confirmed)
        booking.setUser(user);

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> bookingService.cancelBooking(1L));
        verify(bookingRepository, never()).save(booking); // Should not save
    }

    @Test
    void shouldThrowException_WhenBookingUnavailableSeat() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("testuser");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(screeningRepository.findById(10L)).thenReturn(Optional.of(screening));
        when(seatRepository.findAllById(any())).thenReturn(List.of(seat));

        Ticket bookedTicket = new Ticket();
        bookedTicket.setStatus(Ticket.Status.BOOKED);

        // Mock that the seat is already booked for this screening
        when(ticketRepository.findByScreeningIdAndSeatId(10L, 100L)).thenReturn(bookedTicket);

        // Act & Assert
        // Expect SeatNotAvailableException (or RuntimeException if not specific)
        // Checking Service Impl: throws SeatNotAvailableException
        assertThrows(com.example.movie.exception.SeatNotAvailableException.class,
                () -> bookingService.createBooking(createRequest));
    }
}
