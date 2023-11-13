export const renderSection = (title: string, content: string) => (
  <>
    <h1 className="sectionTitle">{title}</h1>
    <hr className="rounded" />
    <span className="sectionDescription">{content}</span>
  </>
);
