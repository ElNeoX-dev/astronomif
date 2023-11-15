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
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center p-3">
          <div className="text-2xl font-bold text-center">{title}</div>
          <div className="text-center">{description}</div>
        </div>
        <div className="mt-4"></div>
      </div>
    </Link>
  );
};

export default ListItem;
