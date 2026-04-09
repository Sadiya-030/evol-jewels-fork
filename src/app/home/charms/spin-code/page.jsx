import { redirect } from "next/navigation";

const page = () => {
  // Redirect to phone login flow for spin eligibility
  redirect("/home/charms/spin-code/login");
};

export default page;
