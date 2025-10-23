"use client";
import { recipesColumns } from "@/app/constants/data";
import { paginate } from "@/app/services/helpers";
import { useHomeContext } from "@/app/context/homeContext/homeContext";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { Recipe } from "@/shemas/recipe";
import { deleteRecipesFromServer } from "@/app/services/services";
import { useRouter } from "next/navigation";
import Notification from '@/app/components/shared/notification'
import Link from "next/link";
import Label from "../shared/label";
import useHelpers from "@/app/hooks/useHelpers";
import { useCallback, useEffect, useMemo } from "react";
import SortedLink from "../shared/sortedLink";
import useSorting from "@/app/hooks/useSorting";


const RecipesTable = ({items}: {items: Recipe[]}) => {
  const { state, dispatch } = useHomeContext();
  const { raiseNotification } = useHelpers()
  const router = useRouter()
  const {sortData, sortStatus, sortedData} = useSorting({data: items})
  const paginateItems = useMemo(() => paginate(10, state.currentPage, sortedData),[state.currentPage, sortedData]);
  const itemsToDisplay = paginateItems ? paginateItems : [];
  
  useEffect(()=> {dispatch({type: 'RESET_STATE'})}, [dispatch])

  const handleDelete = useCallback(async(rec: Recipe) => {
    const response = await deleteRecipesFromServer(rec.id)
    raiseNotification(response)
    router.replace("recipes")
  },[raiseNotification, router])
 

  return (
    <div>
      <table className="w-full table-fixed mb-4 ">
        <thead>
          <tr className="border-b-1 h-8 border-gray-200">
            {recipesColumns.map((column) => (
              <th key={column.accessor} className={column.className}>
                {column.accessor === 'tax' || column.accessor === 'sellingPrice' || column.accessor === 'profitMargin' || column.accessor === 'totalCost'
                ? 
                <SortedLink onSort={sortData} sortStatus={sortStatus}>
                {column.header}
                </SortedLink>
                : column.header
                 }
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-500 text-md">
          {itemsToDisplay.map((item) => (
            <tr
              key={item.id}
              className="border-b h-12.5 border-gray-200 text-sm"
            >

              <td className="pl-4 md:pl-0 pt-2">
                <Link href={`/recipes/${item.id}`}>
                  <div className="flex items-center gap-2">
                    <Image
                      className="w-9 h-9 rounded-full object-cover"
                      src={item.imgPath || '/images/placeholder-image.png'}
                      alt={item.title}
                      width={1200}
                      height={800}
                    />
                    <p className="text-sm break-words transition-colors duration-300 ease-in-out hover:text-gray-400">
                      {item.title}
                    </p>
                  </div>
                </Link>
              </td>

              <td className="hidden md:table-cell pl-4">
                {item.tax * 100} %
              </td>

              <td className="hidden md:table-cell pl-4">€ {item.sellingPrice}</td>

              <td className="hidden md:table-cell pl-4">
                <Label text={`${String(item.profitMargin)} %`} type={ item.profitMargin && item.profitMargin > 60 ? 'high' : item.profitMargin && item.profitMargin > 50 ? 'medium' : 'low' } />
                 
                </td>

              <td className="hidden md:table-cell align-middle text-center md:text-start md:pl-4">
                € {item.totalCost}
              </td>
              <td className="align-middle text-center gap-5 flex justify-center md:text-start md:justify-start mt-4 md:pl-4">
                <Link href={`/recipes/edit/${item.id}`}>
                  <Pencil
                    size="18px"
                    strokeWidth="1.5px"
                    className="cursor-pointer"
                  />
                </Link>

                <Trash2
                  onClick={() => handleDelete(item)}
                  size="18px"
                  strokeWidth="1.5px"
                  color="red"
                  className="cursor-pointer"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {state.notification.isOpen && <Notification />}
    </div>
  );
};

export default RecipesTable;

/* const ClientOnlyTime = ({ date }: { date: string | number | Date }) => {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    setFormattedTime(new Date(date).toLocaleDateString());
  }, [date]);


  return <>{formattedTime}</>;
}; */
