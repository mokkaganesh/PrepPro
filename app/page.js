import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";



export default function Home() {
  return (
    <div>
      <h1>AI Mock Interview</h1>
      <Image src="/vercel.svg" alt="logo" width={200} height={500} />
      
      <Link href={`/dashboard`}>
        <Button>Click me</Button>
      </Link>


    </div>
  );
}
