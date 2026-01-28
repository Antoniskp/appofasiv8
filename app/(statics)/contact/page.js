export const metadata = {
  title: 'Επικοινωνία - Εφαρμογή Ειδήσεων',
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
              Θα χαρούμε να επικοινωνήσετε μαζί μας! Αν έχετε ερωτήσεις, σχόλια ή θέλετε απλώς να πείτε ένα γεια,
              μπορείτε να μας βρείτε μέσω των παρακάτω τρόπων.
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
                <h2 className="text-xl font-semibold mb-2">Τηλέφωνο</h2>
                <p className="text-gray-700">
                  <a href="tel:+11234567890" className="text-blue-600 hover:text-blue-800">
                    (123) 456-7890
                  </a>
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Ώρες Λειτουργίας</h2>
                <p className="text-gray-700">
                  Δευτέρα - Παρασκευή: 9:00 - 17:00
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Διεύθυνση</h2>
                <p className="text-gray-700">
                  Οδός Ειδήσεων 123<br />
                  Media City, MC 12345<br />
                  Ηνωμένες Πολιτείες
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
