import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";

const Signup = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [error, setError] = useState("");
  const [bCheck, setCheck] = useState(false);

  useEffect(() => {
    if (password === checkPassword) {
      setCheck(true);
    } else {
      setCheck(false);
    }
  }, [password, checkPassword]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "passwordCheck") {
      setCheckPassword(value);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(credentials.user, {
        displayName: name,
      });
      router.push("/");
    } catch (e: any) {
      console.log("회원가입err", e);
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
      //   setError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-center mt-50 w-100% min-h-screen">
      <h1 className="text-3xl mb-6 mt-5">회원가입</h1>
      <form onSubmit={onSubmit} className="">
        <div className="mb-6">
          <input
            onChange={onChange}
            type="text"
            id="name"
            name="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="닉네임"
            required
          />
        </div>
        <div className="mb-6">
          <input
            onChange={onChange}
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="이메일"
            required
          />
        </div>
        <div className="mb-6">
          <input
            onChange={onChange}
            type="password"
            name="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="비밀번호(6자이상)"
            required
          />
        </div>
        <div className="mb-6">
          <input
            onChange={onChange}
            type="password"
            name="passwordCheck"
            id="confirm_password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="비밀번호확인"
            required
          />
          {!bCheck && <p className="text-red-500">비밀번호를 확인해주세요.</p>}
        </div>
        <button
          type="submit"
          disabled={!bCheck}
          className="text-white bg-sky-500 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {isLoading ? "로딩중..." : "회원가입"}
        </button>
      </form>
      <span className="mt-3">
        아이디가 있으신가요?{" "}
        <span
          onClick={() => router.push("/login")}
          className="text-sky-400 cursor-pointer ml-2"
        >
          로그인 &rarr;
        </span>
      </span>
    </div>
  );
};

export default Signup;
