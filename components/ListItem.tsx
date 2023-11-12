import Image from "next/image";
import Link from "next/link";

interface ListItemProps {
  imageUrl: string;
  title: string;
  description: string;
  link: string;
}

const ListItem: React.FC<ListItemProps> = ({
  imageUrl,
  title,
  description,
  link,
}) => {
  return (
    <Link href={link}>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center p-3">
          <div className="w-[200px] h-[200px] rounded-[50%] overflow-hidden">
            <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" />
          </div>
          <div className="text-2xl font-bold text-center">{title}</div>
          <div className="text-center">{description}</div>
        </div>
        <div className="mt-4"></div>
      </div>
    </Link>
  );
};

export default ListItem;
