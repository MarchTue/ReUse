import SignupClientComponent from "@/components/auth/signup/signupClientComponent";

interface SignupPageProps {
  searchParams: {
    key: string;
    [key: string]: string | string[] | undefined;
  };
}

export default async function SignUpPage({ searchParams }: SignupPageProps) {

  const initialKey = searchParams.key;
  return (
    <>
      <div className="min-h-screen flex  flex-col  bg-white">
        {/* <div className="flex items-center justify-center px-6 py-4 bg-white"> */}
        {/* <h1 className="text-lg font-semibold">회원가입</h1> */}
        {/* </div> */}
        <SignupClientComponent initialKey={initialKey} />
      </div >
    </>
  );
}