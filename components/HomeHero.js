import Link from 'next/link';

/**
 * Hero section for the homepage
 */
export default function HomeHero() {
  return (
    <section className="bg-blue-600 text-white py-20">
      <div className="app-container text-center">
        <h4 className="text-4xl md:text-6xl font-bold mb-4">
          Καλώς ήρθες στο πρόγραμμα διαχείρησης κοινότητας.
        </h4>
        <h4 className="text-4xl md:text-6xl font-bold mb-4">
          Αποφάσισε για την περιοχή σου.
        </h4>
        <p className="text-xl md:text-2xl mb-8">
          Η αξιόπιστη πηγή σας για τις πιο πρόσφατες ειδήσεις και άρθρα.
        </p>
        <Link href="/articles" className="btn-secondary bg-white">
          Όλα τα Άρθρα
        </Link>
      </div>
    </section>
  );
}
