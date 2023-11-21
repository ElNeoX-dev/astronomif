"use client";
import Image from "next/image";
import Link from "next/link";

interface ListItemProps {
  title: string;
  type: string;
  description: string;
  link: string;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  type,
  description,
  link,
}) => {
  return (
    <Link href={link}>
      <div className="flex flex-col items-center justify-center z-20 py-2 overflow-x-hidden">
        <div className="flex flex-col items-center justify-center z-20 item p-2">
          <div className="font-responsive font-bold text-center z-20">
            {title}
          </div>
          <div className="font-responsive text-center z-20">
            {description.substring(0, 150)}...
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListItem;
