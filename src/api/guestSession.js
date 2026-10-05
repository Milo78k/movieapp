import { requestTmdb } from './tmdb';

export const createGuestSession = async () => {
  const data = await requestTmdb('/authentication/guest_session/new');
  if (!data.guest_session_id)
    throw new Error('Не удалось создать гостевую сессию.');
  return data.guest_session_id;
};

// Concurrent callers share one session; a failed creation can be retried.
export const createGuestSessionProvider = (create = createGuestSession) => {
  let sessionPromise;
  return () => {
    if (!sessionPromise) {
      sessionPromise = Promise.resolve()
        .then(create)
        .catch((error) => {
          sessionPromise = undefined;
          throw error;
        });
    }
    return sessionPromise;
  };
};
