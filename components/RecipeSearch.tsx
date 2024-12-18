"use client";
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { ScaleLoader } from "react-spinners";
import Image from "next/image";

interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType?: string;
}

const examples = ["Biryani", "Chicken Karahi", "Nihari", "Haleem", "Chapli Kabab"];

function RecipeSearch() {
  const [query, setQuery] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSearched(true);
    setRecipes([]);
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&addRecipeInformation=false&apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`
      );
      const data = await response.json();
      setRecipes(data.results || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto p-4 md:p-6">
      <header className="flex flex-col items-center mb-8 justify-evenly">
        <h1 className="text-3xl font-bold mb-2">Recipe Search</h1>
        <p className="text-lg mb-6">
          Find delicious recipes by ingredients or recipe name.
        </p>
        <div className="mb-6">
        <p className="text-lg sm:text-xl mb-3">Try searching for:</p>
      <div className="flex flex-wrap gap-2 mt-2">
      {examples.map((example) => (
        <span
          key={example}
          className="px-4 py-2 bg-gray-200 rounded-md cursor-pointer text-sm sm:text-base md:text-lg"
          onClick={() => setQuery(example)}
           >
          {example}
        </span>
      ))}
        </div>
      </div>
        <form className="relative w-full max-w-md mb-8" onSubmit={handleSearch}>
          <Input
            type="search"
            placeholder="Search for recipes..."
            className="pr-10 border border-gray-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <SearchIcon className="w-5 h-5" />
          </Button>
        </form>
      </header>
      {loading ? (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <ScaleLoader color="#000" />
          <p className="mt-4 text-lg">Loading recipes, please wait...</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 px-4">
          {searched && recipes.length === 0 && (
            <p className="text-center col-span-full text-xl font-semibold text-red-400">
              No recipes found. Try searching with different keywords.
            </p>
          )}
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="group relative hover:shadow-xl shadow-lg rounded-lg overflow-hidden">
              <Image
                src={recipe.image}
                alt={recipe.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover group-hover:opacity-75 transition-opacity rounded-t-lg"
              />
              <CardContent className="p-4 bg-white text-start">
                <h2 className="text-xl font-semibold mb-3">{recipe.title}</h2>
                <div className="flex justify-start items-center">
                  <Link
                    href={`https://spoonacular.com/recipes/${recipe.title.replace(
                      / /g,
                      "-"
                    )}-${recipe.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:underline text-lg"
                  >
                    View Recipe
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeSearch;
