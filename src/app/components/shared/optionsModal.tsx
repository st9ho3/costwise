// src/components/shared/optionsModal.tsx

"use client"
import React from 'react'
import { UtensilsCrossed, Carrot, Users } from 'lucide-react';
import Link from 'next/link';
import { useUIStore } from '@/app/stores/uiStore';
import type { LucideIcon } from 'lucide-react';

// --- Internal Sub-Component ---
interface OptionItemProps {
    href: string;
    icon: LucideIcon;
    label: string;
    description: string; // Added description for better UX
    closeModal: () => void;
    colorClass: string; // To give each item a subtle brand color
}

const OptionItem = ({ href, icon: Icon, label, description, closeModal, colorClass }: OptionItemProps) => {
    return (
        <Link 
            href={href} 
            onClick={(e) => {
                // Keep your existing delay logic
                e.stopPropagation();
                setTimeout(() => closeModal(), 300); 
            }}
            className="block w-full"
        >
            <div className={`
                group flex items-center gap-4 p-4 rounded-xl
                transition-all duration-200 ease-in-out
                hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100
            `}>
                {/* Icon Container: Subtle circle that pops with color on hover */}
                <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full 
                    bg-gray-50 text-gray-500 transition-colors duration-200
                    ${colorClass} group-hover:text-white
                `}>
                    <Icon size={22} strokeWidth={2} />
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                    <span className="text-base font-semibold text-gray-900 group-hover:text-gray-900">
                        {label}
                    </span>
                    <span className="text-xs text-gray-500 font-medium tracking-wide">
                        {description}
                    </span>
                </div>
            </div>
        </Link>
    )
}

// --- Main Component ---
const OptionsModal = () => {
    const closeModal = useUIStore((state) => state.closeModal)

    return (
        <div className="w-full max-w-sm">
            {/* Header */}
            <div className="px-2 mb-4">
                <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                    Create New
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                    What would you like to add today?
                </p>
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-2">
                <OptionItem 
                    href="/recipes/create"
                    icon={UtensilsCrossed}
                    label="Recipe"
                    description="Create a new dish or menu item"
                    closeModal={closeModal}
                    colorClass="group-hover:bg-orange-500" // Orange hover for Recipes
                />

                <OptionItem 
                    href="/ingredients/create"
                    icon={Carrot}
                    label="Ingredient"
                    description="Add raw materials to inventory"
                    closeModal={closeModal}
                    colorClass="group-hover:bg-green-500" // Green hover for Ingredients
                />

                <OptionItem 
                    href="/suppliers/create"
                    icon={Users}
                    label="Supplier"
                    description="Manage vendor details"
                    closeModal={closeModal}
                    colorClass="group-hover:bg-blue-500" // Blue hover for Suppliers
                />
            </div>
        </div>
    )
}

export default OptionsModal;