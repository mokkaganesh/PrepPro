import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";



export default function Home() {
  return (
    <div>
      <h1>AI Mock Interview</h1>
      <Image src="/logo2.svg" alt="logo" width={200} height={200} />
      {/* logo maker */}
      {/* https://studio.creativefabrica.com/vectorizer/2mEyZx1qCYco90aBhT0M6a7EkV3 */}
      {/* https://www.design.com/maker/logo/6065b164-80a9-44f7-ab07-f902d53b5843/draft/b2dd4259-d98e-47e7-9d06-de53d06c89db */}
      
      <Link href={`/dashboard`}>
        <Button>Click me</Button>
      </Link>
       {/* <Link href={`/home`}>
        <Button>payment</Button>
       </Link> */}
       <Link href={`/dashboard/matchedskills`}>
        <Button>you matched skills</Button>
       </Link>



    </div>
  );
}
