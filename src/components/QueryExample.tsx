import { useQuery } from "@tanstack/react-query";

const QueryExample = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=5"
      );
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error)
    return (
      <div className="p-4 text-red-600">Error: {(error as Error).message}</div>
    );

  type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Sample Posts (jsonplaceholder)</h2>
      <ul className="space-y-2">
        {data.map((post: Post) => (
          <li key={post.id} className="border rounded p-2 bg-white shadow">
            <div className="font-semibold">{post.title}</div>
            <div className="text-gray-600 text-sm">{post.body}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QueryExample;
