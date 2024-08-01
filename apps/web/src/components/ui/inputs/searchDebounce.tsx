// "use client";
// import { useRouter } from "next/navigation";
// import useDebounce from "@/hooks/debounce";
// import { DetailedHTMLProps, InputHTMLAttributes } from "react";

// export default function SearchDebounce(
//   props: DetailedHTMLProps<
//     InputHTMLAttributes<HTMLInputElement>,
//     HTMLInputElement
//   >,
// ) {
//   const router = useRouter();
//   const { value, setValue } = useDebounce(() => router.push(`?s=${value}`));
//   return <input {...props} onChange={(e) => setValue(e.target.value)} />;
// }
