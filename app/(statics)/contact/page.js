export const metadata = {
  title: 'Contact Us - News App',
  description: 'Get in touch with us for any questions or feedback',
};

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="app-container">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        
        <div className="card p-8">
          <div className="max-w-2xl">
            <p className="text-gray-700 mb-6">
              We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, 
              feel free to reach out to us through any of the following channels.
            </p>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Email</h2>
                <p className="text-gray-700">
                  <a href="mailto:info@newsapp.com" className="text-blue-600 hover:text-blue-800">
                    info@newsapp.com
                  </a>
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Phone</h2>
                <p className="text-gray-700">
                  <a href="tel:+11234567890" className="text-blue-600 hover:text-blue-800">
                    (123) 456-7890
                  </a>
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Office Hours</h2>
                <p className="text-gray-700">
                  Monday - Friday: 9:00 AM - 5:00 PM EST
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Address</h2>
                <p className="text-gray-700">
                  123 News Street<br />
                  Media City, MC 12345<br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
