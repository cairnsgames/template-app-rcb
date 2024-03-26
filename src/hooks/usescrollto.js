const useScrollTo = () => {
    const scrollTo = (ref) => {
        console.log(ref.current);
        ref.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
    };
  
    return { scrollTo };
  };
  
  export default useScrollTo;