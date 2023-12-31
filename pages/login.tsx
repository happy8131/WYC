import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import Layout from "../components/layout";

const Login = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "" || password === "") return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (e: any) {
      console.log("회원가입ERR", e);
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center text-center min-h-screen">
        <h1 className="text-3xl mb-6 mt-5">로그인</h1>
        <form onSubmit={onSubmit} className="">
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
              placeholder="비밀번호"
              required
            />
          </div>

          <button
            type="submit"
            className="text-white bg-sky-500 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {isLoading ? "로딩중..." : "로그인"}
          </button>
        </form>
        {error !== "" ? (
          <span className="text-red-500 font-bold">{error}</span>
        ) : null}
        <span className="mt-3">
          아이디가 없으세요?
          <span
            onClick={() => router.push("/signup")}
            className="text-sky-400 cursor-pointer ml-2"
          >
            회원가입 &rarr;
          </span>
        </span>
      </div>
    </Layout>
  );
};

export default Login;
