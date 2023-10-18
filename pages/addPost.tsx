import { v4 as uuidv4 } from "uuid";
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
import Layout from "../components/layout";
import Swal from "sweetalert2";

export const TextArea = styled.textarea`
  margin-top: 5px;
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: #dac2c2;
  width: 50%;
  resize: none;
  cursor: pointer;
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

export const TitleContainer = styled.section`
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

export const AttachFileButton = styled.label`
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

export const SubmitBtn = styled.input`
  background-color: #5bbce2;
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
    const { files }: any = e?.target;
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
      Swal.fire({
        icon: "info",
        title: "제목을 입력해주세요!",
        // footer: '<a href="/overview"><b>본인 인증으로 전체 아이디 확인하기</b></a>',
      });
    } else if (!file) {
      Swal.fire({
        icon: "info",
        title: "사진 첨부 부탁드립니다!",
        // footer: '<a href="/overview"><b>본인 인증으로 전체 아이디 확인하기</b></a>',
      });
    } else if (description === "") {
      Swal.fire({
        icon: "info",
        title: "후기글 입력해주세요!",
        // footer: '<a href="/overview"><b>본인 인증으로 전체 아이디 확인하기</b></a>',
      });
    } else {
      if (!user) return;
      Swal.fire({
        icon: "question",
        title: "작성 완료 하셨나요?",
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소",
      }).then(async (res) => {
        if (res.isConfirmed) {
          try {
            setLoading(true);
            const doc = await addDoc(collection(db, "camping"), {
              title,
              description,
              created: Date.now(),
              username: user.displayName,
              uuid: uuidv4(),
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
            router.push("/campingList");
          }
        }
      });
    }
  };

  return (
    <Layout>
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center text-center min-h-screen "
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
        />

        <TextArea
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setDescription(e.target.value)
          }
          required
          rows={10}
          maxLength={180}
          placeholder="후기글"
        />
        <SubmitBtn
          type="submit"
          value={isLoading ? "Loading..." : "게시하기"}
        />
      </form>
    </Layout>
  );
};

export default PostAdd;
