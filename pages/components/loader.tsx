import Image from "next/image";

const Loader: React.FC = () => {
  return (
    <Image
      src="/loader.gif"
      alt="loading..."
      width="100px"
      height="100px"
      layout="fixed"
      priority
    />
  );
};

export default Loader;
