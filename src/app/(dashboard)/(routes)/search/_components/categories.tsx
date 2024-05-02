'use client'

import { Category } from "@prisma/client"
import { IconType } from "react-icons"
import {
    FcMusic,
    FcStatistics,
    FcEngineering,
    FcDatabase,
    FcMultipleDevices

} from "react-icons/fc"
import CategoryItem from "./category-item"

interface CategoriesProps {
    items: Category[]
}

const iconMap: Record<Category['name'], IconType> = {
    'Música': FcMusic,
    'Ciência da Computação': FcMultipleDevices,
    'Tecnologia': FcDatabase,
    'Finanças': FcStatistics,
    'Engenharia': FcEngineering,
}

export const Categories = ({ items }: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((category) => (
                <CategoryItem key={category.id} label={category.name} icon={iconMap[category.name]} value={category.id} />
            ))}
        </div>
    )
}