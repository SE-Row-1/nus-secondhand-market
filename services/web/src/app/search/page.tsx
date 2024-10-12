import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchBar } from "./search-bar";
import { SearchResults } from "./search-results";

export default function SearchPage() {
  return (
    <Suspense>
      <SearchBar />
      <SearchResults />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: "Search",
};
