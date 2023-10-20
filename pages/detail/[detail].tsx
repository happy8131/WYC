import { Unsubscribe } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import Layout from "../../components/layout";
import { IPost } from "../../components/postList";
import StarRating from "../../components/starRating";
import { auth, db } from "../../firebase";
import { HLine, TextArea, TitleContainer } from "../addPost";

export const Div = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: #dac2c2;
  width: 50%;
  height: 300px;

  resize: none;
  text-align: left;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const StarCheckContainer = styled.div`
  margin-top: 20px;
  height: 20px;
  font-size: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Detail = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const id = router.query.detail;
  const [detailTitle, setDetailTitle] = useState("");
  const [detailPhoto, setDetailPhoto] = useState("");
  const [detailDescription, setDetailDescription] = useState("");
  const [checkRating, setCheckRating] = useState(0);
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    setDetailTitle(
      sessionStorage.getItem("detailTitle") as SetStateAction<string>
    );
    setDetailPhoto(
      sessionStorage.getItem("detailPhoto") as SetStateAction<string>
    );
    setDetailDescription(
      sessionStorage.getItem("detailDescription") as SetStateAction<string>
    );
    setCheckRating(sessionStorage.getItem("myRating") as any);
    let unsubscribe: Unsubscribe | null = null;
    if (!user) return;
    const fetchPosts = async () => {
      const postsQuery = query(collection(db, "camping"));
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

        setPosts(posts as any);
      });
    };
    fetchPosts();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Layout>
      <div className="flex flex-col items-center text-center min-h-screen ">
        <h1 className="mt-10 font-bold text-[30px]">상세 페이지</h1>
        <HLine />
        <TitleContainer>
          {/* <input
          className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg mb-5"
          value={posts[0]?.title}
        /> */}

          <div className="bg-gray-100 border h-[40px] text-center w-[300px] font-bold border-gray-300 text-gray-900 text-sm rounded-lg mb-5">
            <h1 className="mt-1.5 text-xl ">{detailTitle}</h1>
          </div>
        </TitleContainer>
        {/* <img src={posts[0]?.photo} alt="img" /> */}
        {detailPhoto && (
          <img
            className="rounded-xl"
            src={detailPhoto}
            alt="cover"
            width="450px"
            height="300%"
          />
        )}
        <h3 className="mt-3 -mb-3"> 캠핑장 어떠셨나요? </h3>
        <StarCheckContainer>
          <StarRating postRating={checkRating} />
        </StarCheckContainer>
        <Div>{detailDescription}</Div>
      </div>
    </Layout>
  );
};

export default Detail;
