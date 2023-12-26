import { useRouter } from "next/router";
import { AvatarImg } from "./myPost";
import { IPost } from "./postList";
import StarRating from "./starRating";

export default function Post({
  username,
  avatarPhoto,
  photo,
  title,
  description,
  userId,
  uuid,
  rating,
  id,
}: IPost) {
  const router = useRouter();

  const onClick = () => {
    localStorage.setItem("detailTitle", title);
    localStorage.setItem("detailPhoto", photo as string);
    localStorage.setItem("detailDescription", description);
    localStorage.setItem("myRating", rating);
    router.push(`/detail/${id}`);
  };

  return (
    <div
      onClick={onClick}
      className="flex flex-col m-3 rounded-xl w-full
    transition duration-300 transform border border-gray-300
    hover:scale-105
    hover:shadow-lg
    dark:border-gray-200/50
    dark:hover:shadow-gray-400/40
    hover:text-blue-600"
    >
      <img
        className="rounded-xl w-full h-full"
        src={photo as any}
        alt="cover"
      />
      <div className="p-4 flex flex-col ">
        <h1 className="text-2xl font-bold">{title}</h1>
        <h3 className="mt-4 text-xl">{description?.slice(0, 20)}...</h3>
        <div className="flex  justify-between">
          <div className="flex items-center md:text-sm font-semibold">
            {Boolean(avatarPhoto) ? (
              <AvatarImg src={avatarPhoto as string} />
            ) : (
              <AvatarImg src="/logo4.jpg" />
            )}
            {username}
          </div>
          <div className="">
            <StarRating postRating={rating} />
          </div>
        </div>
      </div>
    </div>
  );
}
