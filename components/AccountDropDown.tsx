"use client";

import Image from "next/image";
import { useState } from "react";
import SignOutButton from "./SignOutButton";

interface Props {
  username: string;
  imgUrl: string;
}

export default function AccountDropDown({ username, imgUrl }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      onMouseLeave={() => setIsOpen(false)}
      className="flex flex-col items-center"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        <Image
          src={imgUrl}
          alt="profile img"
          width={35}
          height={35}
          className="rounded-full"
        />
      </button>
      {isOpen && (
        <ul className="sm:absolute sm:right-0 sm:top-10 p-5 bg-background-dark text-foreground-dark flex flex-col gap-1">
          <li>{username}</li>
          <hr />
          <li>Profile</li>
          <SignOutButton />
        </ul>
      )}
    </div>
  );
}
