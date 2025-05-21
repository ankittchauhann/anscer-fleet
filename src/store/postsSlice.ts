import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

interface PostsState {
    savedPosts: Post[];
}

const initialState: PostsState = {
    savedPosts: [],
};

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        savePost: (state, action: PayloadAction<Post>) => {
            // Only save if not already present
            if (!state.savedPosts.find((p) => p.id === action.payload.id)) {
                state.savedPosts.push(action.payload);
            }
        },
    },
});

export const { savePost } = postsSlice.actions;
export default postsSlice.reducer;
