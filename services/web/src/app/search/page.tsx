import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchBar } from "./search-bar";
import { SearchResults } from "./search-results";

export const metadata: Metadata = {
  title: "Search",
};

export default function SearchPage() {
  return (
    <Suspense>
      <SearchBar />
      <SearchResults />
    </Suspense>
  );
}
