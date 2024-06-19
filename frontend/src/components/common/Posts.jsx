import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType }) => {
  const getFeedPosts = () => {
    if (feedType === "all") {
      return "http://localhost:5000/api/post/all";
    } else if (feedType === "following") {
      return "http://localhost:5000/api/post/feedPosts";
    } else {
      return "http://localhost:5000/api/post/all";
    }
  };
  const PostEndPoint = getFeedPosts();

  const { data: posts, isLoading ,refetch,isRefetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(PostEndPoint, {
          method: "GET",
          credentials: "include",
        });
        const data = res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
		throw new Error(error);
	  }
    },
  });

  useEffect(()=>{
	refetch();
  },[feedType])
  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!(isLoading || isRefetching) && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!(isLoading || isRefetching) && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
