import { RefObject } from "react";

const useScrollTo = () => {
  const scrollTo = (ref: RefObject<HTMLElement>) => {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return { scrollTo };
};

export default useScrollTo;
