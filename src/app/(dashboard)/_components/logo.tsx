import { NextPage } from "next";
import Image from "next/image";

interface Props {}

const Logo: NextPage<Props> = ({}) => {
  return <Image src={'/logo.svg'} height={130} width={130} alt="logo"/>;
};

export default Logo;
