import React, { createContext, useContext } from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DEFAULT_TOAST_THEME = 'colored'; 

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationContextProps {
  showNotification: (message: string, type?: NotificationType, options?: ToastOptions) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const showNotification = (message: string, type: NotificationType = 'info', options: ToastOptions = {}) => {
    const defaultOptions: ToastOptions = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: DEFAULT_TOAST_THEME,
      ...options,
    };

    switch (type) {
      case 'success':
        toast.success(message, defaultOptions);
        break;
      case 'error':
        toast.error(message, defaultOptions);
        break;
      case 'info':
        toast.info(message, defaultOptions);
        break;
      case 'warning':
        toast.warn(message, defaultOptions);
        break;
      default:
        toast(message, defaultOptions);
        break;
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <ToastContainer />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};