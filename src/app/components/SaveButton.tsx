import React from "react";
import { Save } from "lucide-react";

interface SaveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  label = "Save Changes",
  icon,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={`bg-[#475DB1] col-span-2 cursor-pointer w-full text-white px-8 py-3 rounded-full font-semibold tracking-wide hover:bg-[#3b4d9c] transition-all duration-300 border border-transparent hover:border-[#475DB1] hover:shadow-[0_0_25px_rgba(71,93,177,0.4)] flex items-center justify-center gap-3 group ${disabled ? "opacity-75 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {icon ? icon : <Save className="w-4 h-4" />}
      {disabled ? "Saving..." : label}
    </button>
  );
};
