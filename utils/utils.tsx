import Link from "next/link";

export const renderSection = (title: string, content: string) => (
  <>
    <h1 className="sectionTitle">{title}</h1>
    <hr className="rounded" />
    <span className="sectionDescription">{content}</span>
  </>
);

export const renderSubSection = (title: string, ...points: string[]) => (
  <>
    <h1 className="subSectionTitle">{title}</h1>
    <hr className="rounded" />
    <ul className="list-disc">
      {/* TODO : add bullet points  */}
      {points.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </ul>
  </>
);

export const renderSubSectionParent = (
  title: string,
  description: string,
  link: string
) => (
  <>
    <h1 className="subSectionTitle">{title}</h1>
    <hr className="rounded" />
    <ul className="list-disc">
      <li>
        <Link href={link}>{description}</Link>
      </li>
    </ul>
  </>
);
