import { SignUp } from "@clerk/nextjs";
import Nav from "@/components/Nav";

export default function SignUpPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 flex items-center justify-center py-16 px-6">
        <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
      </main>
    </>
  );
}
