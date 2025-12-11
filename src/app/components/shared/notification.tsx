"use client";

import { notificationVariants } from '@/app/constants/data';
import { useNotificationStore } from '@/app/stores/notificationStore';

const Notification = () => {

  const notification = useNotificationStore((state) => state.notification)
  
  
  const variant = notificationVariants[notification.notificationType] || notificationVariants.info;
  const { Icon, iconClass, borderClass, bgClass, title: defaultTitle } = variant;

  return (
    <div
      className={`fixed z-150 top-5 right-5 flex items-center justify-between max-w-md mx-auto p-4 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] border ${borderClass} ${bgClass}`}
    >
      <div className="flex items-center">
        <Icon className={`mr-4 flex-shrink-0 ${iconClass}`} size={24} strokeWidth={2} />
        <div>
          <p className="font-semibold text-gray-800">
            {variant.title || defaultTitle}
          </p>
          {notification.message && (
            <p className="text-sm text-gray-600">{notification.message}</p>
          )}
        </div>
      </div>
      {/* You could add a close button here if needed */}
    </div>
  );
};

export default Notification;