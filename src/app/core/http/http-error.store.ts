import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type HttpErrorMessageKey =
  | 'errors.network'
  | 'errors.unauthorized'
  | 'errors.forbidden'
  | 'errors.server'
  | 'errors.generic';

interface HttpErrorState {
  messageKey: HttpErrorMessageKey | null;
  status: number | null;
}

export const HttpErrorStore = signalStore(
  { providedIn: 'root' },
  withState<HttpErrorState>({ messageKey: null, status: null }),
  withMethods((store) => ({
    report(status: number): void {
      const messageKey: HttpErrorMessageKey =
        status === 0
          ? 'errors.network'
          : status === 401
            ? 'errors.unauthorized'
            : status === 403
              ? 'errors.forbidden'
              : status >= 500
                ? 'errors.server'
                : 'errors.generic';

      patchState(store, { messageKey, status });
    },
    clear(): void {
      patchState(store, { messageKey: null, status: null });
    },
  })),
);
