import Animation from "../components/home/animation";
import Link from "next/link";
import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout>
      <section className="flex min-h-screen items-center justify-center flex-col text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              안녕하세요 With You Camping 입니다!
              <br className="hidden lg:inline-block" />
              캠핑 후기를 공유 해볼까요?
            </h1>
            <p className="mb-8 leading-relaxed">
              오늘은 어디로 가볼까? 가족, 친구와 함께 떠나는 캠핑 추억에 남는
              캠핑 SITE, 캠핑지의 위치, 조건, 평점 등 원하는 캠핑 정보를 쉽게
              얻어 갈 수 있어요. 지금 With You Camping 과 공유해요.
            </p>
            <div className="flex justify-center ">
              <Link href="/campingList">
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
    </Layout>
  );
}
