import type { Metadata } from "next";
import { PublishItemForm } from "./form";

export default function PublishPage() {
  return <PublishItemForm />;
}

export const metadata: Metadata = {
  title: "Publish Item",
};
