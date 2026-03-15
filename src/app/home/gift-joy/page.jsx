"use client";
import GiftJoyScreenV2 from "../../../components/gift-joy/GiftJoyScreenV2";
import GiftJoyOptionScreen from "../../../components/gift-joy/GiftJoyOptionScreen";
import GiftJoyScreen from "../../../components/gift-joy/GiftJoyScreen";
import React, { useEffect, useState } from "react";
import { browseStore } from "../../../store/browseProduct";
import { usePreferenceProdStore } from "../../../store/preferenceProdStore";
import { useGreetingStore } from "../../../store/greetingStore";

const page = () => {
  const [PageState, setPageState] = useState("");
  const {
    browseProducts,
    setBrowseProducts,
    clearBrowseProducts,
    hasHydrated,
  } = browseStore();
  const { clearPreferenceProd } = usePreferenceProdStore();
  const { setSelectedCard } = useGreetingStore();
  useEffect(() => {
    clearBrowseProducts();
    clearPreferenceProd();
    setSelectedCard({
      templateName: "",
      msg: "",
      img: "",
      theirName: "",
      yourName: "",
    });
  }, []);
  return (
    <div>
      {!["guided", "free"]?.includes(PageState) && (
        <GiftJoyOptionScreen setPageState={setPageState} />
      )}
      {PageState === "guided" && (
        <GiftJoyScreen setPageState={setPageState} type="guided" />
      )}
      {PageState === "free" && (
        <GiftJoyScreenV2 setPageState={setPageState} type="free" />
      )}
    </div>
  );
};

export default page;
