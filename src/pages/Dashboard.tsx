import React from "react";


function DashboardPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="">

        <h2 className="font-bold text-center text-2xl text-neutral-800 dark:text-neutral-200">
          Welcome to Genesis DeFi 🚀
        </h2>

        <p className="text-center text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Login to genesis because we are the best in the world.
        </p>

      </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export default DashboardPage;
