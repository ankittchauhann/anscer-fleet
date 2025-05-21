import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const ReduxPosts = () => {
    const savedPosts = useSelector(
        (state: RootState) => state.posts.savedPosts
    );

    return (
        <div className="p-4 border rounded bg-white mb-4">
            <h3 className="font-bold mb-2">
                Saved Posts (Redux, click a row to save next id)
            </h3>
            <ul className="space-y-2 max-h-48 overflow-auto">
                {savedPosts && savedPosts.length > 0 ? (
                    savedPosts.map((post) => (
                        <li
                            key={post.id}
                            className="border rounded p-2 bg-gray-50"
                        >
                            <div className="font-semibold">{post.title}</div>
                            <div className="text-gray-600 text-sm">
                                {post.body}
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">No posts saved yet.</li>
                )}
            </ul>
        </div>
    );
};

export default ReduxPosts;
