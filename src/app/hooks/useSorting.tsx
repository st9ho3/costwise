import { useState } from "react"
import { ingredientColumns } from "../constants/data"

interface SortingProps<T> {
    data: T[]
}

export interface Filter {
    isFiltering: boolean
    isAscending: boolean
    value: string
}

const useSorting = <T,>({data}: SortingProps<T>) => {

    const [sortedData, setSortedData] = useState<T[]>(data)
    const [sortStatus, setSortStatus] = useState({isFiltering: false, isAscending: false, value: ''})

    const sortData = (value: string) => {
        setSortStatus(prev => ({...prev, isFiltering: true}))

        const column = ingredientColumns.find((col) => col.header === value)

        if (!column) return;

        const key = column.accessor as keyof T

        const dataToMutate = [...sortedData]

        dataToMutate.sort((a,b) => {

            const aVal = a[key]
            const bVal = b[key]

            if (typeof aVal === 'number' && typeof bVal === 'number' ) {
                return sortStatus.isAscending ? aVal - bVal : bVal - aVal
            }

            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortStatus.isAscending
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal)
            }

            return 0
        })

        setSortStatus(prev => ({
            ...prev,
            isAscending: !prev.isAscending,
            value: value
        }))

        setSortedData(dataToMutate)
    }

    return {
        sortData,
        sortStatus,
        sortedData
    }
}

export default useSorting