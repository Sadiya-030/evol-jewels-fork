import { FetchCupons } from "../../../../utils/FetchCupons";
import CharmsCodePage from "../../../../components/charms/CharmsCodePage";
import React from "react";

const page = async () => {
  return (
    <div className=" min-h-screen overflow-hidden">
      <CharmsCodePage link="/home/charms/charms-code/select-charms" />
    </div>
  );
};

export default page;
