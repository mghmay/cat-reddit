import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	selectAllPosts,
	selectPostsStatus,
	selectPostsError,
	fetchPosts,
} from "./postsSlice";
import Post from "../../components/Post";

export const Posts = () => {
	const dispatch = useDispatch();
	const allPosts = useSelector(selectAllPosts);
	const postsStatus = useSelector(selectPostsStatus);
	const postsError = useSelector(selectPostsError);

	useEffect(() => {
		if (postsStatus === "idle") {
			dispatch(fetchPosts());
		}
	}, [dispatch, postsStatus]);

	return (
		<div>
			{/* if there are posts in state map over them and return a list of Post components which are shown on the front page */}
			{allPosts &&
				allPosts.map((post) => (
					<Post
						key={post.data.name}
						title={post.data.title}
						url={post.data.url}
						subreddit={post.data.subreddit}
						selftext={post.data.selftext}
					/>
				))}
		</div>
	);
};

export default Posts;
