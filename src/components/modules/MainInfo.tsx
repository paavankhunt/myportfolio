import Image from 'next/image';

export const MainInfo = () => {
  return (
    <div className="flex flex-col md:flex-row items-center max-w-5xl mx-auto gap-8">
      {/* Profile Image */}
      <div className="flex flex-col items-center md:w-1/3">
        <Image
          className="rounded-full shadow-lg"
          src="https://avatars.githubusercontent.com/u/69294115?v=4"
          width={180}
          height={180}
          alt="Paavan Khunt"
        />
        <h2 className="text-2xl font-semibold mt-4 text-primary">
          Paavan Khunt
        </h2>
      </div>

      {/* Info Section */}
      <div className="md:w-2/3 text-center md:text-left">
        <h1 className="text-4xl font-bold text-primary">Hello 👋</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
          I am a software engineer with <strong>3 years</strong> of experience
          in Web and Mobile application development. I have expertise in
          programming languages such as
          <strong> JavaScript, Java, and TypeScript</strong>. With my skills and
          experience, I am confident in my ability to solve complex technical
          challenges and contribute to any software development team.
        </p>
      </div>
    </div>
  );
};
