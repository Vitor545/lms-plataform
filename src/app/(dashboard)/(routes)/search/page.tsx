import { db } from '@/lib/db';
import { NextPage } from 'next'
import { Categories } from './_components/categories';
import { SearchInput } from '@/components/search-input';
import { getCourses } from '@/actions/get-courses';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CoursesList from './_components/courses-list';

interface Props {
  searchParams: {
    title: string
    categoryId: string
  }
}

const SearchPage: NextPage<Props> = async ({ searchParams: { title, categoryId } }) => {
  const { userId } = auth();
  if (!userId) redirect('/')
  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const courses = await getCourses({
    title,
    categoryId,
    userId,
  })

  return (
    <>
      <div className='px-6 pt-6 md:hidden md:mb-0 block'>
        <SearchInput />
      </div>
      <div className='p-6 space-y-4'>
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  )
}

export default SearchPage