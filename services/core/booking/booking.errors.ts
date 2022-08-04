export const bookingBadRequest = new Error('Bad request');

export const errorGettingSingleBooking = new Error(
  'Error getting booking details',
);
export const errorGettingBookingList = new Error(
  'Error getting booking list',
);
export const invalidBookingId = new Error('Invalid booking ID requested');
export const noBookingId = new Error('Could not find booking by ID');
export const permissionDenied = new Error('You do not have permissions');
