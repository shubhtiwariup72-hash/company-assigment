const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3">
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Nopser Research Pvt Ltd. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
