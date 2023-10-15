import Layout from "../components/layout";
import {
  ChangeEvent,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useRouter } from "next/router";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const TextArea = styled.textarea`
  margin-top: 5px;
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: #dac2c2;
  width: 50%;
  resize: none;
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

const TitleContainer = styled.section`
  input {
    width: 100%;
    height: 35px;
    box-sizing: border-box;
    padding-left: 10px;
    font-size: 1.2rem;
    outline: none;
    &:focus {
      /* outline: 3px solid #FFD600; */
      outline: 3px solid #a7aaad;
      border: #ffd600;
    }
  }
`;

export const HLine = styled.div`
  display: block;
  margin-bottom: 50px;

  width: 100%;
  height: 1px;

  background-color: #aaa;
`;

const AttachFileButton = styled.label`
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const SubmitBtn = styled.input`
  background-color: skyblue;
  color: white;
  border: none;
  padding: 5px;
  border-radius: 10px;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const PostAdd = () => {
  const [imageSrc, setImageSrc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const user = auth.currentUser;
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  const encodeFileToBase64 = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e?.target;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    if (files && files.length === 1) {
      if (Math.floor(files[0].size / 1024) <= 1024) {
        setFile(files[0]);
      } else {
        alert("1MB이하로 부탁드립니다.");
        return;
      }
    }
    return new Promise(() => {
      reader.onload = () => {
        setImageSrc(reader.result as SetStateAction<string>);
      };
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (title === "") {
      alert("제목을 입력해주세요!");
    } else if (!file) {
      alert("사진 첨부부탁드립니다");
    } else if (description === "") {
      alert("후기글 입력해주세요!");
    } else {
      if (!user) return;
      try {
        setLoading(true);
        const doc = await addDoc(collection(db, "camping"), {
          title,
          description,
          created: Date.now(),
          username: user.displayName,
          userId: user.uid,
        });

        if (file) {
          const locationRef = ref(storage, `camping/${user.uid}/${doc.id}`);
          const result = await uploadBytes(locationRef, file);
          const url = await getDownloadURL(result.ref);
          await updateDoc(doc, {
            photo: url,
          });
        }
        setTitle("");
        setDescription("");
        setFile(null);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
        router.push("/");
      }
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col  items-center text-center min-h-screen"
    >
      <h1 className="mt-10 font-bold text-[30px]">게시글 작성</h1>
      <HLine />
      <TitleContainer>
        <input
          type="text"
          name="title"
          className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg mb-5"
          placeholder="제목"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
      </TitleContainer>
      <div className="w-[200px] flex justify-center items-center border rounded">
        {imageSrc && <img src={imageSrc} alt="img" />}
      </div>
      <AttachFileButton htmlFor="file">
        {file ? "사진 추가 완료!" : "사진 추가(1MB이하)"}
      </AttachFileButton>
      <input
        id="file"
        type="file"
        className="hidden"
        onChange={encodeFileToBase64}
        accept="image/*"
        required
      />

      <TextArea
        onChange={(e) => setDescription(e.target.value)}
        required
        rows={10}
        maxLength={180}
        placeholder="후기글"
      />
      <SubmitBtn type="submit" value={isLoading ? "Loading" : "게시하기"} />
    </form>
  );
};

export default PostAdd;
