export const metadata = {
  title: 'Κανόνες - Εφαρμογή Ειδήσεων',
  description: 'Κατευθυντήριες γραμμές και κανόνες κοινότητας',
};

export default function RulesPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="app-container">
        <h1 className="text-4xl font-bold mb-8">Κανόνες Κοινότητας</h1>
        
        <div className="card p-8">
          <div className="max-w-3xl">
            <p className="text-gray-700 mb-6">
              Καλώς ήρθατε στην Εφαρμογή Ειδήσεων! Για να διασφαλίσουμε μια θετική εμπειρία για όλους,
              παρακαλούμε ακολουθήστε τους κανόνες και τις οδηγίες της κοινότητας.
            </p>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-3">1. Σεβασμός και ευγένεια</h2>
                <p className="text-gray-700">
                  Συμπεριφερθείτε με σεβασμό σε όλους. Η παρενόχληση, η ρητορική μίσους ή η διάκριση
                  οποιασδήποτε μορφής δεν είναι ανεκτές.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-3">2. Ακριβής πληροφόρηση</h2>
                <p className="text-gray-700">
                  Μοιραστείτε μόνο επαληθευμένες και ακριβείς πληροφορίες. Η παραπληροφόρηση και οι ψευδείς ειδήσεις
                  υπονομεύουν την αξιοπιστία της πλατφόρμας και θα αφαιρούνται.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-3">3. Πρωτότυπο περιεχόμενο</h2>
                <p className="text-gray-700">
                  Σεβαστείτε τα δικαιώματα πνευματικής ιδιοκτησίας. Αναφέρετε τις αρχικές πηγές
                  και μην αντιγράφετε περιεχόμενο από άλλες πηγές.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-3">4. Ιδιωτικότητα</h2>
                <p className="text-gray-700">
                  Προστατεύστε την ιδιωτικότητά σας και των άλλων. Μην κοινοποιείτε προσωπικά δεδομένα
                  χωρίς συναίνεση.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-3">5. Κατάλληλο περιεχόμενο</h2>
                <p className="text-gray-700">
                  Διατηρήστε το περιεχόμενο κατάλληλο για όλους. Ρητό, βίαιο ή άλλο ακατάλληλο περιεχόμενο
                  θα αφαιρείται.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-3">6. Spam και αυτοπροβολή</h2>
                <p className="text-gray-700">
                  Αποφύγετε την υπερβολική αυτοπροβολή ή το spam. Εστιάστε στη δημιουργία ουσιαστικού περιεχομένου
                  για την κοινότητα.
                </p>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-gray-700">
                  <strong>Σημείωση:</strong> Η παραβίαση των κανόνων μπορεί να οδηγήσει σε αφαίρεση περιεχομένου,
                  αναστολή λογαριασμού ή μόνιμο αποκλεισμό ανάλογα με τη σοβαρότητα. Αν δείτε παραβιάσεις,
                  παρακαλούμε ενημερώστε την ομάδα συντονισμού.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
