import React, { ReactNode } from "react";

interface MobileListCardProps {
  title: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

const MobileListCard = ({ title, actions, children }: MobileListCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4">
      <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
        <div className="font-semibold text-gray-900">{title}</div>
        <div className="flex gap-4 items-center">{actions}</div>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

export const MobileCardRow = ({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) => {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900 font-medium text-right">{value}</span>
    </div>
  );
};

export default MobileListCard;
