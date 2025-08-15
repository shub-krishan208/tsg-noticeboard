const Footer = () => {
  return (
    <footer className="flex-col justify-center w-full py-4">
      {/* Top border */}
      <div className="border-t border-white w-[95%] mb-2 mx-auto"></div>

      {/* Text */}
      <div className="text-center text-white text-sm">
        copyright |{" "}
        <a
          href="/" // Change to your source code link
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow-400 hover:text-yellow-300"
        >
          Source Code
        </a>
      </div>
    </footer>
  );
};

export default Footer;
