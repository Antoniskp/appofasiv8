import Link from 'next/link';

/**
 * AdvertisingBox component displays a visually appealing call-to-action box
 * for advertising and donations. Appears above the footer on all pages.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The title/heading of the advertising box (default: "Χώρος Διαφήμισης")
 * @param {string} props.message - The main message text (default: advertising and donation invitation in Greek)
 * @param {string} props.contactLink - The URL for the contact link (default: "/contact")
 * @param {string} props.contactText - The text for the contact button (default: "Επικοινωνήστε μαζί μας")
 * @returns {JSX.Element} The AdvertisingBox component
 */
export default function AdvertisingBox({ 
  title = "Χώρος Διαφήμισης", 
  message = "Αυτός είναι ένας χώρος για διαφήμιση. Επικοινωνήστε μαζί μας για να τοποθετήσετε τη διαφήμισή σας εδώ ή να κάνετε μια δωρεά!",
  contactLink = "/contact",
  contactText = "Επικοινωνήστε μαζί μας"
}) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t-4 border-blue-600">
      <div className="app-container py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-center border-2 border-blue-200">
          <div className="flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-blue-600 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" 
              />
            </svg>
            <h2 className="text-2xl font-bold text-blue-900">{title}</h2>
          </div>
          <p className="text-gray-700 text-lg mb-6 max-w-3xl mx-auto">
            {message}
          </p>
          <Link 
            href={contactLink}
            className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {contactText}
            <svg 
              className="w-5 h-5 ml-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
