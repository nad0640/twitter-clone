import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useSession } from "~/utils/hooks";
import { signIn } from "next-auth/react";

export default function Tweet() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if ((session.status as string) === "loading") return;

    if (!session?.data?.user) {
      signIn();
    }
  }, [session]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      message: (event.target as unknown as { message: HTMLInputElement })
        .message.value,
    };

    const response = await axios.post("/api/tweet", data);

    if (response.status === 200) {
      return router.push(`/tweet/${response.data.tweetId}`);
    } else {
      toast.error("An error occured. Please try again later.");
      console.error(response);
    }
  };

  return (
    <>
      <Head>
        <title>Tweet - Twitter Clone</title>
      </Head>

      <h1 className="text-4xl font-bold tracking-tighter">
        Tweet something new
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid w-full gap-2 mt-6">
          <Label htmlFor="message">Your message</Label>
          <Textarea className="min-h-[175px]" id="message" />
        </div>

        <div className="flex justify-end mt-4">
          <Button>Tweet</Button>
        </div>
      </form>
    </>
  );
}