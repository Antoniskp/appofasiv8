export const metadata = {
  title: 'Rules - News App',
  description: 'Community guidelines and rules for using News App',
};

export default function RulesPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="app-container">
        <h1 className="text-4xl font-bold mb-8">Community Rules</h1>
        
        <div className="card p-8">
          <div className="max-w-3xl">
            <p className="text-gray-700 mb-6">
              Welcome to News App! To ensure a positive experience for all users, 
              please follow these community guidelines and rules.
            </p>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-3">1. Respect and Civility</h2>
                <p className="text-gray-700">
                  Treat all users with respect. Harassment, hate speech, or discriminatory behavior 
                  of any kind will not be tolerated.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-3">2. Accurate Information</h2>
                <p className="text-gray-700">
                  Share only verified and accurate information. Misinformation and fake news 
                  undermine the integrity of our platform and will be removed.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-3">3. Original Content</h2>
                <p className="text-gray-700">
                  Respect intellectual property rights. Always credit original sources and 
                  do not plagiarize content from other sources.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-3">4. Privacy</h2>
                <p className="text-gray-700">
                  Protect your privacy and that of others. Do not share personal information 
                  without consent.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-3">5. Appropriate Content</h2>
                <p className="text-gray-700">
                  Keep content appropriate for all audiences. Explicit, violent, or otherwise 
                  inappropriate content will be removed.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-3">6. Spam and Self-Promotion</h2>
                <p className="text-gray-700">
                  Avoid excessive self-promotion or spam. Focus on contributing meaningful content 
                  to the community.
                </p>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-gray-700">
                  <strong>Note:</strong> Violation of these rules may result in content removal, 
                  account suspension, or permanent ban depending on the severity of the violation. 
                  If you witness any violations, please report them to our moderation team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
