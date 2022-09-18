import React, { Children } from 'react'

interface TheButtonProps {
  label: string;
  onClick: () => void;
  padding?: string;
  margin?: string;
  border?: string;
  color?: string;
  color2?: string;
  children?: React.ReactNode;
  height?: string;
  radius?: string;
  width?: string;
  textSize?:string
}

export const TheButton: React.FC<TheButtonProps> = ({
  label,
  onClick,
  children,
  padding,
  margin,
  border,
  color,
  color2,
  textSize,
  height,
  radius,
  width,
}) => {
  return (
    <button
    className=' hover:bg-purple-700 hover:text-white'
      onClick={onClick}
      style={{
        backgroundColor: color,
        border,
        borderRadius: radius,
        height,
        width,
        margin:margin??'5px',
        padding:padding??'5px',
        fontSize:textSize??"15px"
        
      }}
    >
      {children ?? label}
    </button>
  );
};
