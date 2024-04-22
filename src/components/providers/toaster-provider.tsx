"use client";
import { NextPage } from "next";
import { Toaster } from "react-hot-toast";

interface Props {}

const ToasterProvider: NextPage<Props> = ({}) => {
  return <Toaster />;
};

export default ToasterProvider;
