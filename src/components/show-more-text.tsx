"use client";
import { useState } from "react";
import { Button } from "./ui/button";

interface ShowMoreTextProps {
  text: string;
  maxLines?: number;
  readMoreText?: string;
  readLessText?: string;
}

export default function ShowMoreText({
  text,
  maxLines = 2,
  readMoreText = "Show more",
  readLessText = "Show less",
}: ShowMoreTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <div
        className={`${!isExpanded ? `line-clamp-${maxLines}` : ""} text-base`}
      >
        {text}
      </div>

      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="link"
        className="p-0"
      >
        {isExpanded ? readLessText : readMoreText}
      </Button>
    </div>
  );
}
