"use client";

import AskQuestionCardDemo from "~/components/ui/landing-page/ask-question-card-demo";
import NavBar from "~/components/ui/landing-page/navBar";

export default function Home() {

  return (
    <div className="bg-white">
      <NavBar />
      <div className="relative isolate px-6">
        <div className="mx-auto max-w-3xl py-32">
          <AskQuestionCardDemo />
        </div>
      </div>
    </div>
  );
}
