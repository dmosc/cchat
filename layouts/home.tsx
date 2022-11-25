import Navbar from "components/navbar";

const HomeLayout: React.FC<ChildrenProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default HomeLayout;