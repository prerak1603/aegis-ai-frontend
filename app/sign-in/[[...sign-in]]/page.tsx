import { SignIn } from "@clerk/nextjs";
import Nav from "@/components/Nav";

export default function SignInPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 flex items-center justify-center py-16 px-6">
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </main>
    </>
  );
}
