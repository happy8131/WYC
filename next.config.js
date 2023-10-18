/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "akamai",
    path: "/",
    domains: ["firebasestorage.googleapis.com"], // 이곳에 에러에서 hostname 다음 따옴표에 오는 링크를 적으면 된다.
  },
  format: ["image/png", "image/webp", "image/jpeg"],
};

module.exports = nextConfig;
