type Props = {
  fallback: string;
  fallbackClass: string;
};

export default function LogoImage({ fallback, fallbackClass }: Props) {
  return (
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-[11px] shrink-0 ${fallbackClass}`}>
      {fallback}
    </div>
  );
}
