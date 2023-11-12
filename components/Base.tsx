interface BaseProps {
  children: React.ReactNode;
}

const Base: React.FC<BaseProps> = ({ children }) => {
  return (
    <>
      <div>TEST</div>
      <div>{children}</div>
    </>
  );
};

export default Base;
