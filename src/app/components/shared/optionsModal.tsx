"use client"
import React from 'react'
import { UtensilsCrossed, Carrot, Users } from 'lucide-react';
import Link from 'next/link';
import { useUIStore } from '@/app/stores/uiStore';

const OptionsModal = () => {

    const closeModal = useUIStore((state) => state.closeModal)

    return (
        // Main container with dashed border and padding, similar to the reference
        <div className="w-full md:w-100 max-w-xs rounded-lg">
            <div className="flex flex-col gap-y-2">

                <h3 className="px-2 py-1 text-lg font-semibold text-gray-500">Create New</h3>

                <Link href="/recipes/create">
                    <div
                        onClick={((e) => {
                            setTimeout(() => {
                                closeModal()
                            }, 1000);
                            e.stopPropagation();
                        })}
                        className="flex items-center gap-x-3 rounded-lg p-2 border-1 border-dashed border-gray-300 transition-colors duration-200 hover:bg-gray-100 cursor-default">
                        <UtensilsCrossed className="h-5 w-5 text-gray-400" />
                        <span className="text-lg text-gray-700">recipe</span>
                    </div>
                </Link>

                <Link href="/ingredients/create">

                    <div
                        className="flex items-center gap-x-3 rounded-lg p-2 border-1 border-dashed border-gray-300 transition-colors duration-200 hover:bg-gray-100 cursor-default"
                        onClick={((e) => {
                            setTimeout(() => {
                                closeModal()
                            }, 1000);
                            e.stopPropagation();
                        })}>
                        <Carrot className="h-5 w-5 text-gray-400" />
                        <span className="text-lg text-gray-700">Ingredient</span>
                    </div>
                </Link>

                <Link href="/suppliers/create">

                    <div
                        className="flex items-center gap-x-3 rounded-lg p-2 border-1 border-dashed border-gray-300 transition-colors duration-200 hover:bg-gray-100 cursor-default"
                        onClick={((e) => {
                            setTimeout(() => {
                                closeModal()
                            }, 1000);
                            e.stopPropagation();
                        })}>
                        <Users className="h-5 w-5 text-gray-400" />
                        <span className="text-lg text-gray-700">Supplier</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default OptionsModal;