import { useState } from "react"
import { ingredientColumns } from "../constants/data"
import { simpleTypedArray } from "./test"

interface SortingProps<T> {
    data: T[],
    sortBy: Array<keyof T>
}

export interface Filter {
    isFiltering: boolean
    isAscending: boolean
    value: string
}



const useSorting = <T,>({data, sortBy}: SortingProps<T>) => {
  

    const [initialData, setInitialData] = useState<T[]>(data)
    const [sortStatus, setSortStatus] = useState({isFiltering: false, isAscending: false, value: ''})

    const sortData = (value: string) => {
        setSortStatus(prev => {return {...prev, isFiltering: true}})
        const column = ingredientColumns.find((col) => col.header === value) 
        
        const dataToMutate = [...initialData]

         
      const dataaaa = [...simpleTypedArray]
        dataaaa.sort((a,b) => a.age - b.age)
        console.log(dataaaa)
        setSortStatus(prev => {return {...prev, isAscending: !prev.isAscending, value: value}})
    }

  return {
    sortData,
    sortStatus
  }
}

export default useSorting
