const useScrollTo = () => {
    const scrollTo = (ref) => {
        ref.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
    };
  
    return { scrollTo };
  };
  
  export default useScrollTo;