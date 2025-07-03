import React, { useState } from 'react';

interface HeaderProps {
  onNavigateHome: () => void;
  onNavigateToAdminLoginScreen: () => void;
  onNavigateToVerifyTicketScreen: () => void; // This function will navigate to the "Mis Tickets" screen
  onNavigateToClaimsScreen: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onNavigateHome, 
  onNavigateToAdminLoginScreen, 
  onNavigateToVerifyTicketScreen,
  onNavigateToClaimsScreen 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClasses = "text-white font-bold py-1.5 px-3 transition-colors duration-200 ease-in-out hover:bg-white/10 hover:rounded text-sm";
  const mobileNavButtonClasses = "text-white font-semibold py-2 px-3 transition-colors duration-200 ease-in-out hover:bg-neutral-700 hover:rounded-md text-sm text-left w-full block"; // Adjusted for mobile menu

  const handleMobileLinkClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="py-2 bg-neutral-800 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Placeholder for potential future logo or site name if needed, or remove div */}
          <div className="flex-shrink-0 h-8 md:h-10 flex items-center"> 
            {/* Intentionally blank, "PUKATU" title is now above the header */}
          </div>
          
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            <button onClick={onNavigateHome} className={navLinkClasses}>HOME</button>
            <button onClick={onNavigateToVerifyTicketScreen} className={navLinkClasses}>MIS TICKETS</button>
            <button onClick={onNavigateToClaimsScreen} className={navLinkClasses}>RECLAMOS</button>
            <button onClick={onNavigateToAdminLoginScreen} className={navLinkClasses}>ADMIN</button>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none p-2 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 bg-neutral-800 rounded-md shadow-lg overflow-hidden">
            <ul className="flex flex-col space-y-1 p-2">
              <li><button onClick={() => handleMobileLinkClick(onNavigateHome)} className={mobileNavButtonClasses}>HOME</button></li>
              <li><button onClick={() => handleMobileLinkClick(onNavigateToVerifyTicketScreen)} className={mobileNavButtonClasses}>MIS TICKETS</button></li>
              <li><button onClick={() => handleMobileLinkClick(onNavigateToClaimsScreen)} className={mobileNavButtonClasses}>RECLAMOS</button></li>
              <li><button onClick={() => handleMobileLinkClick(onNavigateToAdminLoginScreen)} className={mobileNavButtonClasses}>ADMIN</button></li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;