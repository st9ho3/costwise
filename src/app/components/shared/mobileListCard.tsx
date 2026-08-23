import React, { ReactNode } from "react";
import { cn } from "@/app/utils/cn";

interface MobileListCardProps {
  title: ReactNode;
  actions?: ReactNode;
  thumb?: ReactNode;
  children: ReactNode;
  className?: string;
}

const MobileListCard = ({ title, actions, thumb, children, className }: MobileListCardProps) => {
  return (
    <div className={cn("bg-white border border-[#EFE8DA] rounded-[18px] p-4 shadow-[0_1px_2px_rgba(27,26,22,0.05)] mb-3", className)}>
      <div className="flex justify-between items-center pb-3 mb-3 border-b border-[#EFE8DA]">
        <div className="flex items-center gap-3 min-w-0">
          {thumb}
          <div className="font-display font-bold text-[16px] text-ink-900 truncate">{title}</div>
        </div>
        {actions && <div className="flex items-center gap-1 shrink-0 ml-2">{actions}</div>}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};

export const MobileCardRow = ({
  label,
  value,
  isMono = true,
}: {
  label: string;
  value: ReactNode;
  isMono?: boolean;
}) => {
  return (
    <div className="flex justify-between items-center text-[13px] font-body">
      <span className="font-semibold text-stone-500">{label}</span>
      <span className={cn("text-ink-900 font-semibold text-right", isMono && "font-mono tabular-nums")}>
        {value}
      </span>
    </div>
  );
};

export default MobileListCard;
