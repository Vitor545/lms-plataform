import { Button } from "@/components/ui/button";
import { NextPage } from "next";
import Link from "next/link";

interface Props {}

const CoursesPage: NextPage<Props> = ({}) => {
  return <Link href='/teacher/create'>
  <Button>Create</Button>
  </Link>;
};

export default CoursesPage;
