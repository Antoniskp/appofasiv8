export const metadata = {
  title: 'Contact Us - News App',
  description: 'Get in touch with our team. Contact information for News App.',
};

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="app-container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 mb-8">
            We'd love to hear from you. Get in touch with our team.
          </p>

          <div className="card p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
                <p className="text-gray-700 mb-4">
                  Have a question, feedback, or story tip? We're here to help.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <p className="text-gray-700">info@newsapp.com</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Phone</h4>
                    <p className="text-gray-700">(123) 456-7890</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Address</h4>
                    <p className="text-gray-700">
                      123 News Street<br />
                      Media City, MC 12345<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Editorial Team</h3>
                <p className="text-gray-700">
                  For editorial inquiries, story submissions, or press releases, please contact our editorial team at editorial@newsapp.com
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Support</h3>
                <p className="text-gray-700">
                  For technical issues or support, please email support@newsapp.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
