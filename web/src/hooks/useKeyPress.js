import { useState, useEffect } from 'react';

const useKeyPress = callback => {

  const [keyPressed, setKeyPressed] = useState();

  useEffect(() => {
    
    const downHandler = ({ key }) => {
      if (keyPressed !== key && key.length === 1) {
        setKeyPressed(key);
        callback && callback(key);
      }
    };
    
    const upHandler = () => {
      setKeyPressed(null);
    };

    
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    //Prevents spacebar from scrolling down
    window.addEventListener('keydown', function(e) {
      if(e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
      }
    });

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  });
  
  return keyPressed;
};

export default useKeyPress;