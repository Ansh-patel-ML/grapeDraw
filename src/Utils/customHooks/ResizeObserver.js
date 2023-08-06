import { useEffect } from "react";

const useResizeObserver = (ref, callback) => {
  useEffect(() => {
    const resizeObserver = new ResizeObserver(callback);
    const currentRef = ref.current;

    resizeObserver.observe(currentRef);

    return () => {
      resizeObserver.unobserve(currentRef);
    };
  }, [callback, ref]);
};

export default useResizeObserver;
