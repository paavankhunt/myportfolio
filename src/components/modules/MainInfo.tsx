import Image from 'next/image';
import React from 'react';

export const MainInfo = () => {
  return (
    <div className="flex justify-center pt-40 container gap-16 flex-1">
      <div className="flex flex-col justify-start items-center w-1/3">
        <Image
          className="rounded-full"
          src={'https://avatars.githubusercontent.com/u/69294115?v=4'}
          width={200}
          height={200}
          alt={''}
        />
        <div className="text-2xl mt-4">Paavan Khunt</div>
      </div>
      <div className="w-2/3">
        <div className="text-4xl ">Hello</div>
        <div className="text-xl leading-9">
          I am a software engineer with 1 year of experience in the Web and
          Mobile application development. I have expertise in programming
          languages such as JavaScript, Java, and TypeScript. With my skills and
          experience, I am confident in my ability to solve complex technical
          challenges and contribute to any software development team.
        </div>
      </div>
    </div>
  );
};
