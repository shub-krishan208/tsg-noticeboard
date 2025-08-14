const Footer = () => {
  return (
    <footer className="bg-black text-white py-4">
      {/* Top border */}
      <div className="border-t border-white w-full mb-2"></div>

      {/* Text */}
      <div className="text-center text-sm">
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
