import { Unsubscribe } from "firebase/auth";
import {
  collection,
  endAt,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import { HLine } from "../pages/addPost";
import Post from "./post";
import { GiCampingTent } from "react-icons/gi";
import { TfiArrowCircleUp } from "react-icons/tfi";

export interface IPost {
  id: string;
  uuid: string;
  photo?: string;
  avatarPhoto?: string;
  title: string;
  description: string;
  userId: string;
  username: string;
  created: number;
  rating: string;
}

const EmptyPage = styled.div`
  .size-camp {
    font-size: 500px;
    color: rgba(0, 0, 0, 0.1);
  }
  @media screen and (max-width: 500px) {
    display: flex;
    justify-content: center;
    align-items: center;
    .size-camp {
      font-size: 300px;
      position: relative;
      top: 10%;
      left: 3%;
      color: rgba(0, 0, 0, 0.1);
    }
  }
`;

export default function PostList() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, "camping"),
        orderBy("created", "desc"),
        limit(25)
      );

      unsubscribe = await onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => {
          const {
            title,
            description,
            created,
            userId,
            username,
            photo,
            avatarPhoto,
            uuid,
            rating,
          } = doc.data();
          return {
            title,
            description,
            created,
            userId,
            username,
            avatarPhoto,
            photo,
            uuid,
            rating,
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

  const onSearch = () => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, "camping"),
        orderBy("title"), // 제목 정렬
        startAt(keyword),
        endAt(keyword + "\uf8ff")
      );

      unsubscribe = await onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => {
          const {
            title,
            description,
            created,
            userId,
            username,
            photo,
            avatarPhoto,
            uuid,
            rating,
          } = doc.data();

          return {
            title,
            description,
            created,
            userId,
            username,
            avatarPhoto,
            photo,
            uuid,
            rating,
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
  };

  const ResetHandle = async () => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, "camping"),
        orderBy("created", "desc"),
        limit(25)
      );

      unsubscribe = await onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => {
          const {
            title,
            description,
            created,
            userId,
            username,
            photo,
            avatarPhoto,
            uuid,
            rating,
          } = doc.data();
          return {
            title,
            description,
            created,
            userId,
            username,
            avatarPhoto,
            photo,
            uuid,
            rating,
            id: doc.id,
          };
        });
        setPosts(posts);
      });
    };
    fetchPosts();
    setKeyword("");
    return () => {
      unsubscribe && unsubscribe();
    };
  };

  const MoveToTop = () => {
    // top:0 >> 맨위로  behavior:smooth >> 부드럽게 이동할수 있게 설정하는 속성
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-5 lg:mx-[100px]  mt-10">
      <h1 className="text-center text-2xl font-bold sm:text-5xl mb-3">
        캠핑 후기 : {posts.length}
      </h1>
      <HLine />
      <div className="flex justify-end mr-5">
        <input
          className="border rounded-lg pl-1"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="제목"
        />
        <button
          className="ml-0.5 p-1 bg-blue-400 border rounded-lg text-white text-sm"
          onClick={onSearch}
          onKeyDown={onSearch}
        >
          검색
        </button>
        <div
          onClick={ResetHandle}
          className="text-gray-500 hover:cursor-pointer mt-0 items-center flex bg-gray-100 px-2 rounded-md ml-0.5"
        >
          <div>초기화</div>
        </div>
      </div>
      {posts.length ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 m-6 gap-8 cursor-pointer">
            {posts.map((post) => (
              <Post key={post.id} {...post} />
            ))}
          </div>
          {posts.length >= 6 && (
            <div className="h-full flex justify-center text-lg font-normal mb-3">
              <TfiArrowCircleUp
                onClick={MoveToTop}
                className="cursor-pointer transform transition duration-500 hover:scale-125 hover:shadow-xl shadow-xl"
                size="30"
              />
            </div>
          )}
        </>
      ) : (
        <EmptyPage>
          <GiCampingTent className="size-camp" />
        </EmptyPage>
      )}
    </div>
  );
}
