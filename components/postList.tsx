import { Unsubscribe } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import { HLine } from "../pages/addPost";
import Post from "./post";

export interface IPost {
  id: string;
  uuid: string;
  photo?: string;
  title: string;
  description: string;
  userId: string;
  username: string;
  created: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  height: 100vh;
`;

export default function PostList() {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, "camping"),
        orderBy("created", "desc"),
        limit(25)
      );
      // const spanshot = await getDocs(tweetsQuery);

      // const tweets = spanshot.docs.map((doc) => {
      //   const { tweet, created, userId, username, photo } = doc.data();
      //   return {
      //     tweet,
      //     created,
      //     userId,
      //     username,
      //     photo,
      //     id: doc.id,
      //   };
      // });
      unsubscribe = await onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => {
          const { title, description, created, userId, username, photo, uuid } =
            doc.data();
          return {
            title,
            description,
            created,
            userId,
            username,
            photo,
            uuid,
            id: doc.id,
          };
        });
        setPosts(posts);
      });
    };
    fetchPosts();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <div className=" min-h-screen px-5 px-6 lg:mx-[100px]  mt-10">
      <h1 className="text-center text-2xl font-bold sm:text-5xl mb-3">
        캠핑 후기 : {posts.length}
      </h1>
      <HLine />
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 m-6 gap-8 cursor-pointer">
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
