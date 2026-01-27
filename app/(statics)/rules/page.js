export const metadata = {
  title: 'Community Rules - News App',
  description: 'Community guidelines and rules for News App users and contributors.',
};

export default function RulesPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="app-container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Rules</h1>
          <p className="text-lg text-gray-600 mb-8">
            Guidelines and rules for our community to ensure a safe and respectful environment.
          </p>

          <div className="card p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-700">
                  News App is committed to providing accurate, timely, and trustworthy news coverage. 
                  We believe in fostering a community built on respect, integrity, and open dialogue.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Guidelines</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>All articles must be factual and well-researched</li>
                  <li>Sources must be properly cited and credible</li>
                  <li>Misleading or false information is strictly prohibited</li>
                  <li>Content must be original or properly attributed</li>
                  <li>Respect copyright and intellectual property rights</li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">User Conduct</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Treat all community members with respect and dignity</li>
                  <li>No harassment, hate speech, or discriminatory content</li>
                  <li>Constructive criticism is welcome; personal attacks are not</li>
                  <li>Do not spam or post repetitive content</li>
                  <li>Respect user privacy and do not share personal information</li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Editorial Standards</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Maintain objectivity and balance in reporting</li>
                  <li>Clearly distinguish between news and opinion pieces</li>
                  <li>Correct errors promptly and transparently</li>
                  <li>Protect the confidentiality of sources when promised</li>
                  <li>Avoid conflicts of interest and disclose when necessary</li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Enforcement</h3>
                <p className="text-gray-700 mb-4">
                  Violations of these rules may result in:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Content removal or editing</li>
                  <li>Warning or temporary suspension</li>
                  <li>Permanent account termination for severe or repeated violations</li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Reporting Violations</h3>
                <p className="text-gray-700">
                  If you encounter content or behavior that violates these rules, please report it to our moderation team at moderation@newsapp.com
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 italic">
                  These rules are subject to change. Last updated: January 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
