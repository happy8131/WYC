import Animation from "../components/home/animation";
import Link from "next/link";
import Layout from "../components/layout";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { TfiArrowCircleUp } from "react-icons/tfi";

const Container = styled.section`
  /* font-family: "Lato", sans-serif; */
  font-family: "Stylish", sans-serif;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 1200px;
  height: max-content;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Picture = styled.div`
  position: absolute;
  z-index: 10;
  display: grid;
  place-items: center;
  width: 100%;
  background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) 60%,
      rgba(255, 255, 255, 1) 100%
    ),
    url("./img/camping.jpeg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 450px;

  .wrapper {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    width: 100%;
    height: max-content;

    .intro {
      grid-column: 2 / 12;
      /* position: absolute; */

      display: grid;
      width: 100%;
      padding: 70px;
      box-sizing: border-box;
      font-size: 2.1rem;
      height: max-content;

      p {
        color: white;
        margin-top: 20px;

        &:first-child {
          margin-top: 0;
        }
      }
    }
  }

  @media screen and (max-width: 820px) {
    min-height: 300px;
    height: max-content;

    background-image: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 60%,
        rgba(255, 255, 255, 1) 100%
      ),
      url("/img/campingMedia.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    .wrapper {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;

      .intro {
        position: absolute;
        top: 0;
        grid-column: 0 / -1;
        font-size: 1.3rem;
        height: 150px;
        padding: 20px;

        p {
          margin-top: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
`;

const InnerContainer = styled.div`
  position: relative;
  grid-column: 2 / 12;
  width: 100%;
  height: max-content;
  margin-top: 350px;

  section {
    position: relative;
    display: flex;
    align-items: center;
    height: 500px;
    width: 100%;

    .image {
      opacity: 0;
      display: grid;
      place-items: center;
      width: 40%;
      height: 400px;
      transform: translateX(-30px);
      // margin-top: 5rempx;
      img {
        height: 400px;
      }

      transition: 1s;
    }

    .text {
      opacity: 0;
      position: absolute;
      right: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      /* font-size: 0.8rem; */
      width: 700px;
      height: 400px;
      transform: translateX(30px);
      .wrapper {
        display: flex;
      }
      p {
        font-size: 1.8rem;

        margin-bottom: 20px;
        margin-right: 20px;
      }
      transition: 1s 0.5s;
    }
  }
  section.appear {
    .image {
      opacity: 1;
      transform: translateX(0);
    }

    .text {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media screen and (max-width: 820px) {
    width: 100%;
    margin-top: 250px;

    section {
      display: grid;
      place-items: center;
      height: max-content;

      margin-top: 30px;

      .image {
        opacity: 1;
        transform: translateX(0);
        display: flex;
        justify-content: center;
        height: 200px;

        z-index: -1;
        img {
          width: 400px;
          height: auto;
        }
      }

      .text {
        opacity: 1;
        transform: translateX(0);
        &:first:child {
          margin-top: -20px;
        }
        position: static;
        display: flex;
        flex-direction: column;
        align-items: center;

        width: 100%;
        height: 100px;

        .wrapper {
          display: flex;
        }

        p {
          font-size: 1rem;
        }
      }
    }
  }
`;

export default function Home() {
  const router = useRouter();
  const image_1 = useRef(null);
  const image_2 = useRef(null);
  const image_3 = useRef(null);
  const image_4 = useRef(null);

  // 교차감시 -> 해당 요소 보여지면 상태 true 로,
  // 혹은 클래스 추가 ref, addClass
  // 각 요소에 애니메이션 추가
  // forward
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 가시성의 변화가 있으면 관찰 대상 전체에 대한 콜백이 실행,
          if (entry.isIntersecting) {
            entry.target.classList.add("appear");

            io.unobserve(entry.target); // 위 실행을 처리하고(1회) 관찰 중지
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    io.observe(image_1.current as any); //대상 요소의 관찰을 시작합니다.
    io.observe(image_2.current as any);
    io.observe(image_3.current as any);
    io.observe(image_4.current as any);
    // return () => {
    //   io.disconnect()
    // }
  }, []);

  const MoveToTop = () => {
    // top:0 >> 맨위로  behavior:smooth >> 부드럽게 이동할수 있게 설정하는 속성
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      <section className="flex min-h-screen items-center justify-center body-font">
        <Container>
          <Picture>
            <div className="wrapper">
              <div className="intro">
                {/* <p>오늘은 어디로 가볼까?</p>
            <p>지금 With You Camping</p>
            <p> 가슴 설레는</p>
            <p>캠핑 여행을 떠나보아요</p> */}
                &nbsp;
                <p>가족, 친구와 함께 떠나는 캠핑</p>
                <p>추억에 남는 캠핑 SITE</p>
                <p>지금 With You Camping 과 공유해요</p>
                <p></p>
                <span
                  onClick={() => router.push("/campingList")}
                  className="w-[130px] cursor-pointer text-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                >
                  캠핑 후기!
                </span>
              </div>
            </div>
          </Picture>
          <InnerContainer>
            <section className="first" ref={image_1}>
              <div className="image">
                <img src="./img/camping1.png" alt="1" />
              </div>
              <div className="text first-text">
                {/* <p> 나만 알기 아쉬웠던 장소를 </p>
            <p>정확하게 공유 할 수 있어요</p> */}
                <p>캠핑지의 위치, 조건, 평점 등</p>
                <p>필요한 정보를 한 눈에 볼 수 있어요.</p>
              </div>
            </section>
            <section className="second" ref={image_2}>
              <div className="image">
                <img src="./img/camping2.jpg" alt="2" />
              </div>
              <div className="text">
                <p> 캠핑지의 주변 관광 정보를 통해 </p>
                <p> 구체적인 캠핑 계획을 세울 수 있어요</p>
              </div>
            </section>
            <section ref={image_3}>
              <div className="image">
                <img src="./img/camping3.jpg" alt="3" />
              </div>
              <div className="text">
                <p> 검색 기능을 통해</p>
                <p> 원하는 캠핑 정보를 쉽게 얻어 갈 수 있어요</p>
                <p> </p>
              </div>
            </section>
            <section ref={image_4}>
              <div className="image">
                <img src="./img/camping4.jpg" alt="4" />
              </div>
              <div className="text">
                {/* <p> 생생한 후기와 소통을 통해 </p> */}
                <p> 등록된 게시글의 반응을 비교하고 </p>
                <p> 나에게 유용한 정보를 얻어갈 수 있어요</p>
                {/* <p> </p> */}
              </div>
            </section>
          </InnerContainer>
        </Container>
      </section>
      <div className="h-full flex justify-end text-lg font-normal mb-3 mr-5">
        <TfiArrowCircleUp
          onClick={MoveToTop}
          className="cursor-pointer transform transition duration-500 hover:scale-125 hover:shadow-xl shadow-xl"
          size="30"
        />
      </div>
    </Layout>
  );
}
