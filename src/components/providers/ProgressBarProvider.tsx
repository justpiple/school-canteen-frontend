"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const ProgressBarProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#0ca659"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default ProgressBarProviders;
