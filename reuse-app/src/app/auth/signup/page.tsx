import SignupClientComponent from "@/components/auth/signup/signupClientComponent";

interface SignupPageProps {
  searchParams: {
    key?: string;
    [key: string]: string | string[] | undefined;
  };
}

export default async function SignUpPage({ searchParams }: SignupPageProps) {
  const param = await searchParams;
  const initialKey = param.key || '';

  return (
    <>
      <div className="min-h-screen flex  flex-col  bg-white">
        <SignupClientComponent initialKey={initialKey} />
      </div >
    </>
  );
}