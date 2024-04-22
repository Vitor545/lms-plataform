import { NextPage } from "next";
import Logo from "./logo";
import SidebarRoutes from "./sidebar-routes";

interface Props {}

const Sidebar: NextPage<Props> = ({}) => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};

export default Sidebar;
