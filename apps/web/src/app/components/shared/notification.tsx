"use client";

import React, { useEffect } from 'react';
import { useNotificationStore } from '@/app/stores/notificationStore';
import { Toast } from '../ui/toast';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { NotificationType } from '@/types/context';

const Notification = () => {
  const notification = useNotificationStore((state) => state.notification);
  const clearNotification = useNotificationStore((state) => state.clearNotification);

  const type = notification?.notificationType;
  const message = notification?.message;

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 3600);
      return () => clearTimeout(timer);
    }
  }, [message, clearNotification]);

  if (!message) return null;

  let tone: 'good' | 'watch' | 'over' | 'default' = 'default';
  let title = 'Costwise';
  let Icon = Info;

  if (type === NotificationType.Success) {
    tone = 'good';
    title = 'Filed';
    Icon = CheckCircle2;
  } else if (type === NotificationType.Failure) {
    tone = 'over';
    title = 'Something went wrong';
    Icon = AlertCircle;
  } else {
    tone = 'watch';
    title = 'Notice';
    Icon = Info;
  }

  return (
    <div className="fixed bottom-[26px] left-1/2 -translate-x-1/2 z-[120] pointer-events-auto select-none px-4 w-full max-w-[440px] flex justify-center">
      <Toast
        tone={tone}
        icon={<Icon className="size-5 shrink-0" strokeWidth={2} />}
        title={title}
        message={message}
        actionLabel="Dismiss"
        onAction={clearNotification}
      />
    </div>
  );
};

export default Notification;