import React, { useEffect, useState } from 'react';

const Loader = () => {
  const [time, setTime] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => setTime(time + 1), 5000);
    return () => {
      clearInterval(interval);
    };
  }, [time]);

  return (
    <>
      <div className="loader"></div>
      <div className="text-center">
        <p className="loader-text">
          {time % 3 === 1
            ? `Generative AI at work!`
            : time % 3 === 2
            ? 'AI is smart but sometimes slow!'
            : 'This will be done soon'}
        </p>
      </div>
    </>
  );
};

export default Loader;
