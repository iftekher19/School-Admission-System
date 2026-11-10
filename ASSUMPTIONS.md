# Assumptions and Design Decisions

This document describes the assumptions and implementation decisions made while developing the School Admission System.

## 1. Student Identification

**Assumption:** Every student is identified by a unique 17-digit registration number.

**Reason:** The assignment does not require a separate authentication or registration system. Therefore, the student registration number is used as the student identity through the `X-Student-Id` HTTP header.

## 2. Admission Policy

**Assumption:** Admission follows a first-come-first-served policy.

**Reason:** Seats are allocated based on successful reservation requests rather than a lottery or random selection process.

## 3. Temporary Seat Reservation

**Assumption:** A temporary seat reservation remains active for 600 seconds by default.

**Reason:** This provides students with a limited period to complete the admission confirmation process.

The duration can be changed through the `HOLD_DURATION_SECONDS` environment variable.

## 4. Expired Reservations

**Assumption:** An unconfirmed reservation becomes EXPIRED when its expiration time is reached.

**Reason:** Expired reservations should not continue occupying available seats.

The backend periodically checks for expired reservations and updates their status. Relevant API operations also check expiration before processing a hold.

## 5. Admission Confirmation and Payment

**Assumption:** No real payment gateway is required. Clicking the admission payment/confirmation button is treated as successful payment for this assignment.

**Reason:** The assignment allows payment to be assumed successful when the student clicks the payment button.

The application therefore focuses on admission confirmation and seat management rather than external payment processing.

## 6. One Active Application Per Student

**Assumption:** A student may have only one active HELD or CONFIRMED application across all classes.

**Reason:** This prevents duplicate applications and ensures consistent student admission records.

A database-level constraint provides additional protection against concurrent duplicate applications.

## 7. Class and Shift Representation

**Assumption:** Each class or shift combination is represented as a separate class record.

**Reason:** This allows seat capacity and admission reservations to be managed independently for each class or shift.

## 8. Seat Capacity

**Assumption:** Both active HELD reservations and CONFIRMED admissions consume available seats.

**Reason:** A held seat must remain unavailable to other students until the reservation is confirmed, cancelled, or expired.

The backend uses database transactions and locking to prevent concurrent requests from exceeding the configured class capacity.

## 9. Reservation Status

The system uses the following reservation statuses:

- `HELD` — A temporary reservation is active.
- `CONFIRMED` — Admission has been confirmed.
- `EXPIRED` — The reservation period has ended.
- `CANCELLED` — The student cancelled the reservation.

## 10. Database Persistence

**Assumption:** Application data must remain available after application containers restart.

**Reason:** PostgreSQL is configured with a named Docker volume to persist database data independently of the application containers.

## 11. Language Preference

**Assumption:** English is the default application language, and students can switch to Bangla.

**Reason:** Providing both languages improves accessibility for students. The selected language is stored in browser local storage.

## 12. Error Handling

**Assumption:** Invalid input, missing student identity, unavailable seats, and invalid reservation operations should return appropriate HTTP error responses.

**Reason:** Clear API responses help the frontend communicate errors and prevent unexpected server failures.