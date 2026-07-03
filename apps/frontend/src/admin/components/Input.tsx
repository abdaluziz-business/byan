import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, className = '', id, ...props }, ref) {
  return (
    <label className="flex flex-col gap-1 text-sm text-[#111111]">
      {label && <span className="font-medium">{label}</span>}
      <input
        ref={ref}
        id={id}
        className={`rounded-md border border-neutral-300 bg-white px-3 py-2 text-[#111111] outline-none focus:border-[#111111] ${className}`}
        {...props}
      />
    </label>
  );
});
