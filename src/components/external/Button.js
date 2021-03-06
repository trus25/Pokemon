import React from 'react';
import './Button.css';

const STYLES = ['btn--primary', 'btn--outline'];

const SIZES = ['btn--small','btn--medium', 'btn--large', 'btn--mobile', 'btn--wide'];

const COLOR = ['primary', 'blue', 'red', 'green'];

export const Button = ({
  buttonText,
  type,
  onClick,
  buttonStyle,
  buttonSize,
  buttonColor,
  additionalClass,
  style
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];

  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  const checkButtonColor = COLOR.includes(buttonColor) ? buttonColor : null;

  return (
    <button
      className={`btn color-${checkButtonStyle} ${checkButtonSize} ${checkButtonColor} ${additionalClass}`}
      onClick={onClick}
      type={type}
      style={style}
    >
      {buttonText}
    </button>
  );
};
