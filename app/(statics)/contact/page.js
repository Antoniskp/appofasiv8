export const metadata = {
  title: 'Επικοινωνία - Απόφαση',
  description: 'Επικοινωνήστε μαζί μας για ερωτήσεις ή σχόλια',
};

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="app-container">
        <h1 className="text-4xl font-bold mb-8">Επικοινωνία</h1>
        
        <div className="card p-8">
          <div className="max-w-2xl">
            <p className="text-gray-700 mb-6">
              Η μόνη επικοινωνία γίνεται μέσω Discord στο παρακάτω link. Αφήστε μας ένα μήνυμα ή μπείτε σε κάποιο
              chatroom για να μιλήσουμε.
            </p>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Discord</h2>
                <p className="text-gray-700">
                  <a
                    href="https://discord.gg/pvJftR4T98"
                    className="text-blue-600 hover:text-blue-800"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    https://discord.gg/pvJftR4T98
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
