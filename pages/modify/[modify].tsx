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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import Layout from "../../components/layout";
import { IPost } from "../../components/postList";
import { auth, db, storage } from "../../firebase";
import { AttachFileButton, HLine, SubmitBtn, TitleContainer } from "../addPost";

export const Textea = styled.textarea`
  margin-top: 2.5rem;
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

const Modify = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const id = router.query.detail;
  const [imageSrc, setImageSrc] = useState("");
  const [detailTitle, setDetailTitle] = useState("");

  const [detailPhoto, setDetailPhoto] = useState<File | null>(null);
  const [detailDescription, setDetailDescription] = useState("");
  const [docId, setDocId] = useState("");
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setLoading] = useState(false);

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e?.target;
    if (!user) return;

    if (files && files.length === 1) {
      if (Math.floor(files[0].size / 1024) <= 1024) {
        const file = files[0];
        const locationRef = ref(storage, `camping/${user?.uid}/${docId}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        const docRef = doc(db, "camping", docId);

        setDetailPhoto(url as any);
        await updateDoc(docRef, {
          photo: url,
        });
        // setDetailPhoto(file);
      } else {
        alert("1MB이하로 부탁드립니다.");
        return;
      }
    }
  };

  useEffect(() => {
    setDetailTitle(sessionStorage.getItem("myTitle") as SetStateAction<string>);
    setDetailPhoto(
      sessionStorage.getItem("myPhoto") as SetStateAction<File | null>
    );
    setDetailDescription(
      sessionStorage.getItem("myDescription") as SetStateAction<string>
    );
    setDocId(sessionStorage.getItem("idDoc") as SetStateAction<string>);
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      const ref = doc(db, "camping", docId);
      await updateDoc(ref, {
        title: detailTitle,
        description: detailDescription,
        photo: detailPhoto,
      });
      if (!user) return;
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);

      router.back();
    }
  };

  return (
    <Layout>
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center text-center min-h-screen"
      >
        <h1 className="mt-10 font-bold text-[30px]">게시글 수정</h1>
        <HLine />
        <TitleContainer>
          {/* <input
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg mb-5"
            value={posts[0]?.title}
          /> */}

          <input
            type="text"
            name="title"
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg mb-5"
            placeholder="제목"
            required
            value={detailTitle}
            onChange={(e) => setDetailTitle(e.target.value)}
          />
        </TitleContainer>

        {/* <img src={posts[0]?.photo} alt="img" /> */}
        {detailPhoto && (
          <img
            className="rounded-xl"
            src={detailPhoto as any}
            alt="cover"
            width="450px"
            height="300%"
          />
        )}
        <AttachFileButton htmlFor="file">사진 수정(1MB이하)</AttachFileButton>
        <input
          id="file"
          type="file"
          className="hidden"
          onChange={onChange}
          accept="image/*"
        />

        <Textea
          value={detailDescription}
          required
          rows={10}
          maxLength={180}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setDetailDescription(e.target.value)
          }
        />
        <SubmitBtn
          type="submit"
          value={isLoading ? "Loading..." : "수정하기"}
        />
      </form>
    </Layout>
  );
};

export default Modify;
