export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="border border-gray-300 rounded px-3 py-2 w-full"
      {...props}
    />
  );
}