import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { IPost } from "./postList";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const PostEdit = styled.label`
  background-color: skyblue;
  font-size: 12px;
  padding: 3px;
  border-radius: 5px;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const TextEdit = styled.textarea``;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const Photos = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

export const AvatarImg = styled.img`
  width: 5%;
  margin-right: 3px;
`;

export default function MyPost({
  username,
  photo,
  title,
  description,
  userId,
  uuid,
  id,
}: IPost) {
  const user = auth.currentUser;
  const [photoEdit, setPhotoEdit] = useState(photo);
  const [avatar, setAvatar] = useState(user?.photoURL);
  const router = useRouter();

  const onDelete = async () => {
    const ok = confirm("정말 게시글을 삭제 하시겠습니까?");

    if (!ok || user?.uid !== userId) return;

    try {
      await deleteDoc(doc(db, "camping", id));
      if (photo) {
        const photoRef = ref(storage, `camping/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
      router.reload();
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const onClick = () => {
    sessionStorage.setItem("myTitle", title);
    sessionStorage.setItem("myPhoto", photo as string);
    sessionStorage.setItem("myDescription", description);
    sessionStorage.setItem("idDoc", id);
    router.push(`/modify/${id}`);
  };

  return (
    <div
      className="flex flex-col m-3 rounded-xl w-full
    transition duration-300 transform border border-gray-300
    hover:scale-105
    hover:shadow-lg
    dark:border-gray-200/50
    dark:hover:shadow-gray-400/40
    hover:text-blue-600 cursor-pointer"
    >
      <img
        onClick={onClick}
        className="rounded-xl"
        src={photo as any}
        alt="cover"
        width="100%"
        height="60%"
      />
      <div className="p-4 flex flex-col" onClick={onClick}>
        <h1 className="text-2xl font-bold">{title}</h1>
        <h3 className="mt-4 text-xl">{description?.slice(0, 20)}...</h3>
        <div className="flex items-center">
          {" "}
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
          {username}
        </div>
      </div>
      {user?.uid === userId && (
        <DeleteButton onClick={onDelete}>게시글 삭제</DeleteButton>
      )}
    </div>
  );
}
