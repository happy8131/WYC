import React, { useState, useEffect, SetStateAction, Dispatch } from "react";

const Star = ({ starId, marked }: { starId: number; marked: boolean }) => {
  return (
    <span
      star-id={starId}
      role="button"
      style={{ color: "#ff9933", cursor: "pointer", width: "100px" }}
    >
      {marked ? "\u2605" : "\u2606"}
    </span>
  );
};

// Create an array of 5: Array.from({length: 5}, (v,i) => i)

export default function StarRatingCheck({
  checkRating,
  setCheckRating,
}: {
  checkRating: number;
  setCheckRating: Dispatch<SetStateAction<number>>;
}) {
  // Manages on Hover selection of a star
  const [selection, setSelection] = useState(0);

  // 별점 props로 받아 해당 별점 업데이트
  const [rating, setRating] = useState(checkRating);

  useEffect(() => {
    setCheckRating(rating);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rating]);

  const hoverOver = (event: any) => {
    let starId = 0;
    if (event && event.target && event.target.getAttribute("star-id")) {
      starId = event.target.getAttribute("star-id");
    }
    setSelection(starId);
  };

  return (
    <div
      className="flex justify-center mb-5"
      onMouseOver={hoverOver}
      onMouseOut={() => hoverOver(null)}
      onClick={(event: any) => setRating(event.target.getAttribute("star-id"))}
      style={{ width: "10px" }}
    >
      {Array.from({ length: 5 }, (v, i) => (
        <Star
          key={i}
          starId={i + 1}
          marked={selection ? selection > i : rating > i}
        />
      ))}
    </div>
  );
}
