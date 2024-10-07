import type { Metadata } from "next";
import { SearchBar } from "./search-bar";
import { SearchResults } from "./search-results";

export const metadata: Metadata = {
  title: "Search",
};

export default function SearchPage() {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      <SearchBar />
      <SearchResults />
    </div>
  );
}
