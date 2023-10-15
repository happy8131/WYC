import { auth } from "../firebase";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const onLogOut = async () => {
    const ok = confirm("로그아웃 하시겠습니까?");
    if (ok) {
      await auth.signOut();
    }
    router.push("/");
  };

  return (
    <div>
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <Link href="/">
            <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="ml-3 text-xl">With You Camping</span>
            </a>
          </Link>
          <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
            <Link href="/">
              <a className="mr-5 hover:text-gray-900">홈</a>
            </Link>
            <Link href="/campingList">
              <a className="mr-5 hover:text-gray-900">게시글</a>
            </Link>
            {user && (
              <Link href="/addPost">
                <a className="mr-5 hover:text-gray-900">게시글 작성</a>
              </Link>
            )}
            {user && (
              <Link href="/myPage">
                <a className="mr-5 hover:text-gray-900">마이페이지</a>
              </Link>
            )}
            {user ? (
              <div
                onClick={onLogOut}
                className="mr-5 hover:text-gray-900 cursor-pointer"
              >
                로그아웃
              </div>
            ) : (
              <Link href="/login">
                <a className="mr-5 hover:text-gray-900">로그인</a>
              </Link>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;
