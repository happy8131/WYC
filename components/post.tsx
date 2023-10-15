import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import Image from "next/image";
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

export default function Tweet({
  username,
  photo,
  title,
  description,
  userId,
  id,
}: IPost) {
  const user = auth.currentUser;
  const [photoEdit, setPhotoEdit] = useState(photo);

  const onDelete = async () => {
    const ok = confirm("정말 게시글을 삭제 하시겠습니까?");

    if (!ok || user?.uid !== userId) return;

    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const onFileEdit = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e?.target;
    if (user?.uid !== userId) return;
    if (files && files.length === 1 && photo) {
      if (Math.floor(files[0].size / 1024) <= 1024) {
        const file = files[0];
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(photoRef, file);
        const url = await getDownloadURL(result.ref);
        const docRef = doc(db, "tweets", id);
        setPhotoEdit(url);
        await updateDoc(docRef, {
          photo: url,
        });
      } else {
        alert("1MB이하로 부탁드립니다.");
      }
    }
  };

  return (
    <div
      className="flex flex-col m-3 rounded-xl w-full
    transition duration-300 transform border border-gray-300
    hover:scale-105
    hover:shadow-lg
    dark:border-gray-200/50
    dark:hover:shadow-gray-400/40
    hover:text-blue-600"
    >
      <Image
        className="rounded-xl"
        src={photo as any}
        alt="cover"
        width="100%"
        height="60%"
        layout="responsive"
        objectFit="cover"
        quality={100}
      />
      <div className="p-4 flex flex-col ">
        <h1 className="text-2xl font-bold">{title}</h1>
        <h3 className="mt-4 text-xl">{description?.slice(0, 20)}...</h3>
        <div>{username}</div>
      </div>
    </div>
  );
}
