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
import Swal from "sweetalert2";
import { GiCampingTent } from "react-icons/gi";

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

const myPage = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [nameEdit, setNameEdit] = useState<any>(user?.displayName);
  const [bEdit, setbEdit] = useState(false);
  const [docId, setDocId] = useState("");
  const router = useRouter();

  const onAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    try {
      if (files && files.length === 1) {
        const file = files[0];
        const locationRef = ref(storage, `avatars/${user?.uid}`);
        const result = await uploadBytes(locationRef, file);
        const avatarUrl = await getDownloadURL(result.ref);
        //  const docRef = doc(db, "camping", docId);
        setAvatar(avatarUrl);
        await updateProfile(user, {
          photoURL: avatarUrl,
        });
        for (let i = 0; i < posts.length; i += 1) {
          const ref = doc(db, "camping", posts[i]?.id);
          await updateDoc(ref, {
            avatarPhoto: avatarUrl,
          });
        }
      }
    } catch (e) {
      console.log(e);
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
            photo,
            uuid,
            username,
            nameEdit,
            avatarPhoto,
            rating,
            id: doc.id,
          };
        });

        setNameEdit(user?.displayName);
        setPosts(posts);
      });
    };
    fetchPosts();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [bEdit]);

  const onClick = async () => {
    if (!user) return;
    if (nameEdit.length < 2) {
      Swal.fire({
        icon: "info",
        title: "이름은 2글자 이상입니다.",
        // footer: '<a href="/overview"><b>본인 인증으로 전체 아이디 확인하기</b></a>',
      });
      return;
    }
    try {
      await updateProfile(user, {
        displayName: nameEdit,
      });
      for (let i = 0; i < posts.length; i += 1) {
        const ref = doc(db, "camping", posts[i]?.id);
        await updateDoc(ref, {
          username: nameEdit,
        });
      }
      setbEdit(false);
    } catch (err) {
      console.log(err);
    }

    //  router.reload();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameEdit(e.target.value);
  };

  return (
    <Layout>
      <div className="flex flex-col jutify-center items-center min-h-screen px-5 px-6 lg:mx-[100px]  mt-10 ">
        <h1 className="text-center text-2xl font-bold sm:text-5xl mb-3">
          마이페이지
        </h1>
        <HLine />
        <div className="flex justify-center mx-auto ">
          <AvatarUpload htmlFor="avatar">
            {Boolean(avatar) ? (
              <AvatarImg src={avatar as string} />
            ) : (
              <AvatarImg src="/logo4.jpg" />
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
            defaultValue={user?.displayName as any}
          />
          <div className="ml-3 bg-green-500 p-1 rounded-xl">
            <button onClick={onClick} className="text-gray-100">
              수정
            </button>
          </div>
        </div>
        {posts.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 m-6 gap-8 cursor-pointer">
            {posts.map((post) => (
              <MyPost key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <EmptyPage>
            <GiCampingTent className="size-camp" />
          </EmptyPage>
        )}
      </div>
    </Layout>
  );
};

export default myPage;
