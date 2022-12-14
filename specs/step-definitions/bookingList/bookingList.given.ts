import { UserRoles } from 'services/core/user/user.constants';
import { FamilyCarBookingApp } from 'services/db/db.service';
import { calculateFutureTimestampInSecs } from 'specs/step-definitions/step-definition.utils';
import { testData } from 'specs/step-definitions/test-data';

const userSettings = {
  rideCompletionText: 'Машина в гараже',
  notifications: {
    getNotifiedWhenBookingChanged: false,
    getNotifiedWhenBookingCreated: false,
  },
};

export const givenPapaIsRegistered = (given) => {
  given(
    'Papa is registered, provides a family honda car and can drive it',
    async () => {
      await FamilyCarBookingApp.entities.user
        .create({
          username: 'akushlianski',
          firstName: 'Андрей',
          roles: [UserRoles.CAR_PROVIDER, UserRoles.DRIVER],
          availableCarIds: [testData.familyCarId],
          providedCarIds: [testData.familyCarId],
          ...userSettings,
        })
        .go();
    },
  );
};

export const givenIlyaIsRegistered = (given) => {
  given(
    'Ilya is registered, can drive family honda but does not provide any cars',
    async () => {
      await FamilyCarBookingApp.entities.user
        .create({
          username: 'ilya_nice',
          firstName: 'Илья',
          roles: [UserRoles.DRIVER],
          availableCarIds: [testData.familyCarId],
          providedCarIds: [],
          ...userSettings,
        })
        .go();
    },
  );
};

export const givenStrangerIsRegistered = (given) => {
  given(
    'Stranger is registered, provides a BMW and can drive it',
    async () => {
      await FamilyCarBookingApp.entities.user
        .create({
          username: 'stranger',
          firstName: 'Джон',
          roles: [UserRoles.CAR_PROVIDER, UserRoles.DRIVER],
          availableCarIds: [testData.familyCarId],
          providedCarIds: [testData.familyCarId],
          ...userSettings,
        })
        .go();
    },
  );
};

export const givenIlyaHasFutureEvent = (given, now: Date) => {
  given(
    /^there is a booking for user "(.*)" on carId "(.*)" due in (\d+) days called "(.*)"$/,
    async function (
      username: string,
      carId: string,
      daysIntoTheFuture: number,
      bookingDescr: string,
    ) {
      try {
        await FamilyCarBookingApp.entities.booking
          .create({
            username,
            carId,
            startTime: calculateFutureTimestampInSecs(
              now,
              daysIntoTheFuture,
            ),
            description: bookingDescr,
          })
          .go();
      } catch (e) {
        console.error(e);
      }
    },
  );
};
