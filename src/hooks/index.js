import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { showSnackbar, hideSnackbar } from '../app/slices/uiSlice';

/**
 * Typed convenience hooks for Redux.
 */
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

/**
 * Auth selector hook.
 */
export const useAuth = () => useAppSelector((state) => state.auth);

/**
 * Global snackbar hook.
 */
export const useNotification = () => {
  const dispatch = useDispatch();

  const notify = useCallback(
    (message, severity = 'info') => {
      dispatch(showSnackbar({ message, severity }));
    },
    [dispatch]
  );

  const close = useCallback(() => {
    dispatch(hideSnackbar());
  }, [dispatch]);

  return { notify, close };
};
