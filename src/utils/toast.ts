export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

type ToastListener = (toast: ToastMessage) => void;

class ToastEmitter {
  private listeners: ToastListener[] = [];

  subscribe(listener: ToastListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emit(message: string, type: ToastType) {
    const toast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type,
    };
    this.listeners.forEach((listener) => listener(toast));
  }

  success(message: string) {
    this.emit(message, 'success');
  }

  error(message: string) {
    this.emit(message, 'error');
  }

  info(message: string) {
    this.emit(message, 'info');
  }

  warning(message: string) {
    this.emit(message, 'warning');
  }
}

export const toast = new ToastEmitter();
