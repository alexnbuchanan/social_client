import { useState, useRef, useEffect } from "react";

const useOutsideClick = () => {
  const [isVisible, setIsVisible] = useState();
  const ref = useRef();

  const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      console.log("target", event.target, ref.current.contains(event.target));
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return [ref, isVisible, setIsVisible];
};

export default useOutsideClick;
