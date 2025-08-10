const LoginModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-opacity-60"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="bg-black p-8 rounded-lg z-10 w-96 shadow-lg text-white">
        <h2 className="text-center text-2xl mb-6">Login</h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            placeholder="example@dummy.iitkgp.ac.in"
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            placeholder="Password@123"
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
          />
        </div>

        <p className="text-sm text-gray-400 mb-4">Forgot password?</p>

        <button
          className="bg-yellow-400 text-black w-full py-2 rounded font-bold"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
