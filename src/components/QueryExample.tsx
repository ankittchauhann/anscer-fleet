import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useState } from "react";
import ReduxPosts from "./ReduxPosts";
import { useDispatch } from "react-redux";
import { savePost } from "../store/postsSlice";
import type { AppDispatch } from "../store/store";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// Helper to update search param in the URL for /query-example
function updateQueryExampleSearchParam(id?: string) {
    const url = new URL(window.location.href);
    if (id && id.length > 0) {
        url.searchParams.set("id", `"${id}"`);
    } else {
        url.searchParams.delete("id");
    }
    window.history.replaceState({}, "", url.toString());
}

const QueryExample = () => {
    const search = useSearch({ from: "/query-example" });
    const selectedId = search.id ? Number(search.id) : null;
    const [input, setInput] = useState(search.id ?? "");
    const dispatch = useDispatch<AppDispatch>();

    const {
        data: posts,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const url = "https://jsonplaceholder.typicode.com/posts?_limit=15";
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch posts");
            return res.json();
        },
    });

    const {
        data: filteredPosts,
        isLoading: isFilteredLoading,
        error: filteredError,
    } = useQuery({
        queryKey: ["post", selectedId],
        queryFn: async () => {
            if (!selectedId) return null;
            const res = await fetch(
                `https://jsonplaceholder.typicode.com/posts?id=${selectedId}`
            );
            if (!res.ok) throw new Error("Failed to fetch post by id");
            return res.json();
        },
        enabled: !!selectedId,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const num = Number.parseInt(input, 10);
        if (!Number.isNaN(num)) {
            updateQueryExampleSearchParam(input);
        } else {
            updateQueryExampleSearchParam(undefined);
        }
    };

    const handleRowClick = (id: number) => {
        updateQueryExampleSearchParam(String(id));
        setInput(String(id));
        // Save the next post (id+1) to Redux if it exists in posts
        const post = posts.find((p: Post) => p.id === id);
        if (post) {
            dispatch(savePost(post));
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col p-4 h-[calc(100vh_-_64px)] bg-gray-200 overflow-hidden">
                <ReduxPosts />
                <h2 className="text-xl font-bold mb-2">Sample Posts</h2>
                <ul className="space-y-2 overflow-auto border-2 rounded-2xl p-2 bg-white ">
                    {Array.from({ length: 15 }).map((_, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        <li key={i} className="list-none">
                            <Skeleton className="h-12 w-full rounded mb-2" />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    if (error)
        return (
            <div className="p-4 text-red-600">
                Error: {(error as Error).message}
            </div>
        );

    type Post = {
        userId: number;
        id: number;
        title: string;
        body: string;
    };
    console.log("posts", posts);
    console.log("filteredPosts", filteredPosts);

    return (
        <div className=" flex flex-col p-4 h-[calc(100vh_-_64px)] bg-gray-200 overflow-hidden">
            <ReduxPosts />
            <h2 className="text-xl font-bold mb-2">Sample Posts</h2>
            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <label htmlFor="post-number" className="font-medium">
                    Fetch post by number:
                </label>
                <Input
                    id="post-number"
                    type="number"
                    min="1"
                    max="100"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border px-2 py-1 rounded w-24"
                    placeholder="e.g. 3"
                />
                <Button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                    Search
                </Button>
            </form>
            {isFilteredLoading && <div className="p-2">Loading post...</div>}
            {filteredError && (
                <div className="p-2 text-red-600">
                    Error: {(filteredError as Error).message}
                </div>
            )}
            {filteredPosts &&
                Array.isArray(filteredPosts) &&
                filteredPosts.length > 0 && (
                    <div className="mb-4 border rounded p-2 shadow bg-red-100">
                        <div className="font-semibold">
                            {filteredPosts[0].title}
                        </div>
                        <div className="text-gray-600 text-sm">
                            {filteredPosts[0].body}
                        </div>
                    </div>
                )}
            <ul className="space-y-2 overflow-auto border-2 rounded-2xl p-2 bg-white ">
                {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          <li key={i} className="list-none">
                              <Skeleton className="h-12 w-full rounded mb-2" />
                          </li>
                      ))
                    : posts.map((post: Post) => (
                          <li key={post.id} className="list-none">
                              <button
                                  type="button"
                                  aria-pressed={selectedId === post.id}
                                  className={`w-full text-left border rounded p-2 bg-white shadow cursor-pointer hover:bg-blue-100 focus:outline-none${selectedId === post.id ? " ring-2 ring-blue-400" : ""}`}
                                  onClick={() => handleRowClick(post.id)}
                              >
                                  <span className="font-semibold">
                                      {post.title}
                                  </span>
                                  <span className="block text-gray-600 text-sm">
                                      {post.body}
                                  </span>
                              </button>
                          </li>
                      ))}
            </ul>
        </div>
    );
};

export default QueryExample;
