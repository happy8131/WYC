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
import { AvatarImg } from "./myPost";
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

export default function Post({
  username,
  avatarPhoto,
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

  const onClick = () => {
    sessionStorage.setItem("detailTitle", title);
    sessionStorage.setItem("detailPhoto", photo as string);
    sessionStorage.setItem("detailDescription", description);
    router.push(`/detail/${id}`);
  };

  return (
    <div
      onClick={onClick}
      className="flex flex-col m-3 rounded-xl w-full
    transition duration-300 transform border border-gray-300
    hover:scale-105
    hover:shadow-lg
    dark:border-gray-200/50
    dark:hover:shadow-gray-400/40
    hover:text-blue-600"
    >
      <img
        className="rounded-xl w-full h-full"
        src={photo as any}
        alt="cover"
      />
      <div className="p-4 flex flex-col ">
        <h1 className="text-2xl font-bold">{title}</h1>
        <h3 className="mt-4 text-xl">{description?.slice(0, 20)}...</h3>
        <div className="flex items-center">
          {Boolean(avatarPhoto) ? (
            <AvatarImg src={avatarPhoto as string} />
          ) : (
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth="2"
              className="w-6 h-6 text-white p-2 bg-indigo-500 rounded-full"
              aria-hidden="true"
            >
              <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
            </svg>
          )}
          {username}
        </div>
      </div>
    </div>
  );
}
