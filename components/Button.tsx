import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'action' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false,
  disabled,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center";
  
  const variants = {
    primary: "bg-tec-blue text-white hover:bg-tec-orange hover:shadow-lg",
    secondary: "bg-tec-light-blue text-tec-blue hover:bg-opacity-80",
    action: "bg-tec-green text-white hover:bg-opacity-90",
    ghost: "bg-transparent text-gray-600 hover:text-tec-blue hover:underline",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
      ) : null}
      {children}
    </button>
  );
};
