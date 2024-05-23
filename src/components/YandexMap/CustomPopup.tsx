// CustomPopup.tsx

import React from 'react';

interface CustomPopupProps {
  locationName: string;
  onButtonClick: () => void;
}

const CustomPopup: React.FC<CustomPopupProps> = ({ locationName, onButtonClick }) => {
  return (
    <div>
      <div>{locationName}</div>
      <button onClick={onButtonClick}>Custom Button</button>
    </div>
  );
};

export default CustomPopup;
