export type Toast = {
  id: number;
  title: string;
  message: string;
  variant: string;
  time: Date;
  showTime: boolean;
};

export type ToastsContextValue = {
  toasts: Toast[];
  addToast: (title: string, message: string, variant: string, showTime?: boolean) => void;
  closeToast: (id: number) => void;
};
