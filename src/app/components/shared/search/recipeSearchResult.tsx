import { Recipe } from '@/shemas/recipe'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface RecipeSearchResultProps {
    item: Recipe
}

const RecipeSearchResult = ({item}: RecipeSearchResultProps) => {
  
    return (
      <Link href={`/recipes/${item.id}`}>
        <div className="flex items-center gap-2 mb-2">
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
    )
}

export default RecipeSearchResult
