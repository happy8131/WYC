import Animation from "../components/home/animation";
import Link from "next/link";
import Layout from "../components/layout";
import { auth } from "../firebase";

export default function Home() {
  const user = auth.currentUser;

  return (
    <section className="flex min-h-screen items-center justify-center flex-col text-gray-600 body-font">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
            안녕하세요 With You Camping 입니다!
            <br className="hidden lg:inline-block" />
            캠핑 후기를 공유 해볼까요?
          </h1>
          <p className="mb-8 leading-relaxed">
            안녕하세요! 현재 프로젝트는 노션 API로 사용해서 블로그나 노션에
            개인적으로 스터디한걸 취준생 분들 또는 개인 스터디 하시는 분들에게
            조금이나마 도움드리고자 만들게 됐습니다. 종종 제가 공부한 부분을
            현재 프로젝트에 올릴 계획입니다. 도움이 됐으면 좋겠습니다." " 위에
            문의하기 버튼 누르면 Firebase로 만든 Clone프로젝트가 있는데 추가적인
            기능 넣어서 만들었습니다. 토이 프로젝트나 스터디 문의가 있으시면
            문의하기로 남겨주세요!.
          </p>
          <div className="flex justify-center ">
            <Link href="/project">
              <a className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                캠핑 후기!
              </a>
            </Link>
          </div>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <Animation />
        </div>
      </div>
    </section>
  );
}
