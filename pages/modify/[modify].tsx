import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import Layout from "../../components/layout";
import StarRatingCheck from "../../components/starRatingCheck";
import { auth, db, storage } from "../../firebase";
import { AttachFileButton, HLine, SubmitBtn, TitleContainer } from "../addPost";

export const Textea = styled.textarea`
  margin-top: 2.5rem;
  border: 2px solid black;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: black;
  background-color: #f0ecec;
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

const Modify = () => {
  const router = useRouter();
  const user = auth.currentUser;

  const [detailTitle, setDetailTitle] = useState("");

  const [detailPhoto, setDetailPhoto] = useState<File | null>(null);
  const [detailDescription, setDetailDescription] = useState("");
  const [docId, setDocId] = useState("");
  // 평가
  const [checkRating, setCheckRating] = useState(0);
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
        Swal.fire({
          icon: "info",
          title: "1MB 이하로 부탁드립니다.",
          // footer: '<a href="/overview"><b>본인 인증으로 전체 아이디 확인하기</b></a>',
        });
        return;
      }
    }
  };

  useEffect(() => {
    setDetailTitle(localStorage.getItem("myTitle") as SetStateAction<string>);
    setDetailPhoto(
      localStorage.getItem("myPhoto") as SetStateAction<File | null>
    );
    setDetailDescription(
      localStorage.getItem("myDescription") as SetStateAction<string>
    );
    setDocId(localStorage.getItem("idDoc") as SetStateAction<string>);
    setCheckRating(localStorage.getItem("myRating") as any);
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (checkRating < 1) {
      Swal.fire({
        icon: "info",
        title: "별점을 매겨주세요!",
        // footer: '<a href="/overview"><b>본인 인증으로 전체 아이디 확인하기</b></a>',
      });
      return;
    }
    try {
      setLoading(true);

      const ref = doc(db, "camping", docId);
      await updateDoc(ref, {
        title: detailTitle,
        description: detailDescription,
        photo: detailPhoto,
        rating: checkRating,
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
        <h3 className="mt-5"> 캠핑장 어떠셨나요? </h3>
        <StarCheckContainer>
          <StarRatingCheck
            checkRating={checkRating}
            setCheckRating={setCheckRating}
          />
        </StarCheckContainer>
        <SubmitBtn
          type="submit"
          value={isLoading ? "Loading..." : "수정하기"}
        />
      </form>
    </Layout>
  );
};

export default Modify;
