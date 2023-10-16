import { HLine } from "./addPost";
import { useEffect, useState } from "react";
import { IPost } from "../components/postList";
import { Unsubscribe } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import MyPost from "../components/myPost";

const myPage = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, "camping"),
        where("userId", "==", user?.uid),
        orderBy("created", "desc")
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
        마이페이지
      </h1>
      <HLine />
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 m-6 gap-8 cursor-pointer">
        {posts.map((post) => (
          <MyPost key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default myPage;
