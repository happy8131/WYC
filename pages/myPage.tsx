import { HLine } from "./addPost";
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import { IPost } from "../components/postList";
import { Unsubscribe, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import MyPost from "../components/myPost";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import styled from "styled-components";
import { useRouter } from "next/router";
import Layout from "../components/layout";

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;

const EditInput = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
`;

const Name = styled.span`
  font-size: 22px;
  display: flex;
  width: auto;
  text-align: center;
  span {
    margin-left: 5px;
    font-size: 12px;

    padding: 5px;

    background-color: skyblue;
    border-radius: 10px;
    cursor: pointer;
  }
  p {
    font-size: 12px;
    margin-left: 5px;
    padding: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
    text-align: center;
    background-color: skyblue;
    border-radius: 10px;
    cursor: pointer;
  }
`;

const myPage = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [nameEdit, setNameEdit] = useState("");
  const [bEdit, setbEdit] = useState(false);
  const [docId, setDocId] = useState("");
  const router = useRouter();

  const onAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  useEffect(() => {
    setDocId(sessionStorage.getItem("idDoc") as SetStateAction<string>);
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
            photo,
            uuid,
            username,
            id: doc.id,
          };
        });

        setNameEdit(posts[0]?.username);
        setPosts(posts);
      });
    };
    fetchPosts();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  const onClick = async () => {
    if (!user) return;
    if (nameEdit.length < 2) {
      alert("이름은 2글자 이상입니다!");
      return;
    }
    try {
      // await updateProfile(user, {
      //   displayName: nameEdit,
      // });
      const ref = doc(db, "camping", docId);
      await updateDoc(ref, {
        username: nameEdit,
      });
    } catch (err) {
      console.log(err);
    }

    setbEdit(false);
    //  router.reload();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameEdit(e.target.value);
  };

  return (
    <Layout>
      <div className=" min-h-screen px-5 px-6 lg:mx-[100px]  mt-10 ">
        <h1 className="text-center text-2xl font-bold sm:text-5xl mb-3">
          마이페이지
        </h1>
        <HLine />
        <div className="flex justify-center mx-auto ">
          <AvatarUpload htmlFor="avatar">
            {Boolean(avatar) ? (
              <AvatarImg src={avatar as string} />
            ) : (
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
              </svg>
            )}
          </AvatarUpload>
          <AvatarInput
            onChange={onAvatarChange}
            id="avatar"
            type="file"
            accept="image/*"
          />
        </div>
        <div className="flex justify-center text-center mt-1">
          <input
            className="ml-11 text-center w-15"
            onChange={onChange}
            value={nameEdit}
          />
          <div className="ml-3 bg-green-500 p-1 rounded-xl">
            <button onClick={onClick} className="text-gray-100">
              수정
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 m-6 gap-8 cursor-pointer">
          {posts.map((post) => (
            <MyPost key={post.id} {...post} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default myPage;
