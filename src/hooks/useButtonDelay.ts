import { useState } from "react";

function useButtonDelay(delay: number): [() => void, boolean] {
  const [isDelayed, setIsDelayed] = useState(false);

  const handleClick = (): void => {
    setIsDelayed(true);
    setTimeout(() => {
      setIsDelayed(false);
    }, delay);
  };

  return [handleClick, isDelayed];
}

export default useButtonDelay;
