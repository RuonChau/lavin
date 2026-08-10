import { InputNumber, type InputNumberProps } from "antd";
import { cn } from "../utils/cn";

interface InputNumberCustomProps
  extends Omit<
    InputNumberProps<number>,
    "formatter" | "parser" | "controls" | "onChange"
  > {
  error?: boolean;
  onChange?: (value: number | null | undefined) => void;
}

export default function InputNumberCustom({
  value,
  onChange,
  placeholder = "65,000",
  error,
  className,
  ...props
}: InputNumberCustomProps) {
  return (
    <InputNumber<number>
      {...props}
      value={value ?? null}
      onChange={(value) => {
        onChange?.(value === null ? null : value);
      }}
      controls={false}
      placeholder={placeholder}
      status={error ? "error" : undefined}
      formatter={(value) => {
        if (value === undefined || value === null) return "";

        return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }}
      parser={(value) => {
        const cleaned = value?.replace(/[^\d]/g, "");

        if (!cleaned) {
          return undefined as unknown as number;
        }

        return Number(cleaned);
      }}
      className={cn(
        "w-full! h-11.5! rounded-2xl! p-0!",
        "bg-[rgba(255,250,244,0.82)]!",
        "backdrop-blur-[14px]!",
        "border! border-[rgba(216,184,148,0.32)]!",
        "shadow-none! transition-all!",
        "hover:border-[rgba(216,184,148,0.5)]!",
        "focus-within:border-[rgba(216,184,148,0.5)]!",
        "focus-within:shadow-[0_0_0_2px_rgba(216,184,148,0.18)]!",
        "[&_.ant-input-number-input-wrap]:w-full!",
        "[&_.ant-input-number-input-wrap]:h-full!",
        "[&_.ant-input-number-input]:h-11!",
        "[&_.ant-input-number-input]:px-4!",
        "[&_.ant-input-number-input]:text-sm!",
        "[&_.ant-input-number-input]:bg-transparent!",
        "[&_.ant-input-number-input]:outline-none!",
        "[&_.ant-input-number-input]:text-text-primary!",
        "[&_.ant-input-number-input::placeholder]:text-text-muted/40!",
        error && "border-red-400!",
        className
      )}
    />
  );
}