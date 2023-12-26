import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { IPost } from "./postList";
import Swal from "sweetalert2";
import StarRating from "./starRating";

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

export const AvatarImg = styled.img`
  width: 8%;
  border-radius: 10%;
  margin-right: 3px;
`;

export default function MyPost({
  username,
  avatarPhoto,
  photo,
  title,
  description,
  userId,
  uuid,
  rating,
  id,
}: IPost) {
  const user = auth.currentUser;

  const router = useRouter();

  const onDelete = async () => {
    if (user?.uid !== userId) return;

    Swal.fire({
      icon: "question",
      title: "정말 게시글을 삭제 하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await deleteDoc(doc(db, "camping", id));
          if (photo) {
            const photoRef = ref(storage, `camping/${user.uid}/${id}`);
            await deleteObject(photoRef);
          }
        } catch (e) {
          console.log(e);
        } finally {
        }
      }
    });
  };

  const onClick = () => {
    localStorage.setItem("myTitle", title);
    localStorage.setItem("myPhoto", photo as string);
    localStorage.setItem("myDescription", description);
    localStorage.setItem("idDoc", id);
    localStorage.setItem("myRating", rating);
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
    hover:text-blue-600 cursor-pointer "
    >
      <img
        onClick={onClick}
        className="rounded-xl w-full h-full"
        src={photo as any}
        alt="cover"
      />
      <div className="p-4 flex flex-col" onClick={onClick}>
        <h1 className="text-2xl font-bold">{title}</h1>
        <h3 className="mt-4 text-xl">{description?.slice(0, 20)}...</h3>
        <div className="flex  justify-between">
          <div className="flex items-center">
            {" "}
            {Boolean(avatarPhoto) ? (
              <AvatarImg src={avatarPhoto as string} />
            ) : (
              <AvatarImg src="/logo3.jpg" />
            )}
            {user?.displayName}
          </div>
          <div className="">
            <StarRating postRating={rating} />
          </div>
        </div>
      </div>
      {user?.uid === userId && (
        <DeleteButton onClick={onDelete}>게시글 삭제</DeleteButton>
      )}
    </div>
  );
}
