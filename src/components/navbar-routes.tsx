"use client";
import { UserButton } from "@clerk/nextjs";
import { NextPage } from "next";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";

interface Props { }

const NavbarRoutes: NextPage<Props> = ({ }) => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");
  const isSearchPage = pathname?.includes("/search");
  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isPlayerPage ? (
          <Link href="/">
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </Link>
        ) : (
          <Link href="/teacher/courses">
            <Button variant="ghost" size="sm">
              Modo professor
            </Button>
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

export default NavbarRoutes;
