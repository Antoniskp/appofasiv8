/*
 * Municipality data sourced from https://github.com/mathias82/municipality.
 *
 * MIT License
 *
 * Copyright (c) 2017 Matthaios Stavrou
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const greeceMunicipalities = [
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Δράμας",
    "dimos_name": "Δοξάτου"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Δράμας",
    "dimos_name": "Δράμας"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Δράμας",
    "dimos_name": "Κάτω Νευροκοπίου"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Δράμας",
    "dimos_name": "Παρανεστίου"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Δράμας",
    "dimos_name": "Προσοτσάνης"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Έβρου",
    "dimos_name": "Αλεξανδρούπολης"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Έβρου",
    "dimos_name": "Διδυμοτείχου"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Έβρου",
    "dimos_name": "Ορεστιάδας"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Έβρου",
    "dimos_name": "Σαμοθράκης"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Έβρου",
    "dimos_name": "Σουφλίου"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Καβάλας",
    "dimos_name": "Θάσου"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Καβάλας",
    "dimos_name": "Καβάλας"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Καβάλας",
    "dimos_name": "Νέστου"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Καβάλας",
    "dimos_name": "Παγγαίου"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Ξάνθης",
    "dimos_name": "Αβδήρων"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Ξάνθης",
    "dimos_name": "Μύκης"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Ξάνθης",
    "dimos_name": "Ξάνθης"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Ξάνθης",
    "dimos_name": "Τοπείρου"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Ροδόπης",
    "dimos_name": "Αρριανών"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Ροδόπης",
    "dimos_name": "Ιάσμου"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Ροδόπης",
    "dimos_name": "Κομοτηνής"
  },
  {
    "periferies_name": "Ανατολικής Μακεδονίας και Θράκης",
    "nomos_name": "Ροδόπης",
    "dimos_name": "Μαρωνείας - Σαπών"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Ημαθίας",
    "dimos_name": "Αλεξάνδρειας"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Ημαθίας",
    "dimos_name": "Βέροιας"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Ημαθίας",
    "dimos_name": "Ηρωικής Πόλεως Νάουσας"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Θεσσαλονίκης",
    "dimos_name": "Αμπελοκήπων - Μενεμένης"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Θεσσαλονίκης",
    "dimos_name": "Βόλβης"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Θεσσαλονίκης",
    "dimos_name": "Δέλτα"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Θεσσαλονίκης",
    "dimos_name": "Θερμαϊκού"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Θεσσαλονίκης",
    "dimos_name": "Θέρμης"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Θεσσαλονίκης",
    "dimos_name": "Θεσσαλονίκης"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Θεσσαλονίκης",
    "dimos_name": "Καλαμαριάς"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Θεσσαλονίκης",
    "dimos_name": "Κορδελιού - Ευόσμου"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Θεσσαλονίκης",
    "dimos_name": "Λαγκαδά"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Θεσσαλονίκης",
    "dimos_name": "Νέαπολης - Συκεών"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Θεσσαλονίκης",
    "dimos_name": "Μελά"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Θεσσαλονίκης",
    "dimos_name": "Πυλαίας - Χορτιάτη"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Θεσσαλονίκης",
    "dimos_name": "Χαλκηδόνος"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Θεσσαλονίκης",
    "dimos_name": "Ωραιοκάστρου"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Κιλκίς",
    "dimos_name": "Κιλκίς"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Κιλκίς",
    "dimos_name": "Παιονίας"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Πέλλης",
    "dimos_name": "Αλμωπίας"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Πέλλης",
    "dimos_name": "Έδεσσας"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Πέλλης",
    "dimos_name": "Πέλλας"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Πέλλης",
    "dimos_name": "Σκύδρας"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Πιερίας",
    "dimos_name": "Δίου - Ολύμπου"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Πιερίας",
    "dimos_name": "Κατερίνης"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Πιερίας",
    "dimos_name": "Πύδνας - Κολινδρού"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Σερρών",
    "dimos_name": "Αμφίπολης"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Σερρών",
    "dimos_name": "Βισαλτίας"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Σερρών",
    "dimos_name": "Εμμανουήλ Παππά"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Σερρών",
    "dimos_name": "Ηρακλείας"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Σερρών",
    "dimos_name": "Νέας Ζίχνης"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Σερρών",
    "dimos_name": "Σερρών"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Σερρών",
    "dimos_name": "Σιντικής"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Χαλκιδικής",
    "dimos_name": "Αριστοτέλη"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Χαλκιδικής",
    "dimos_name": "Κασσάνδρας"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Χαλκιδικής",
    "dimos_name": "Νέας Προποντίδας"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Χαλκιδικής",
    "dimos_name": "Πολυγύρου"
  },
  {
    "periferies_name": "Κεντρικής Μακεδονίας",
    "nomos_name": "Χαλκιδικής",
    "dimos_name": "Σιθωνίας"
  },
  {
    "periferies_name": "Δυτικής Μακεδονίας",
    "nomos_name": "Γρεβενών",
    "dimos_name": "Γρεβενών"
  },
  {
    "periferies_name": "Δυτικής Μακεδονίας",
    "nomos_name": "Γρεβενών",
    "dimos_name": "Δεσκάτης"
  },
  {
    "periferies_name": "Δυτικής Μακεδονίας",
    "nomos_name": "Καστοριάς",
    "dimos_name": "Καστοριάς"
  },
  {
    "periferies_name": "Δυτικής Μακεδονίας",
    "nomos_name": "Καστοριάς",
    "dimos_name": "Νεστορίου"
  },
  {
    "periferies_name": "Δυτικής Μακεδονίας",
    "nomos_name": "Καστοριάς",
    "dimos_name": "Άργους Ορεστικού"
  },
  {
    "periferies_name": "Δυτικής Μακεδονίας",
    "nomos_name": "Κοζάνης",
    "dimos_name": "Βοίου"
  },
  {
    "periferies_name": "Δυτικής Μακεδονίας",
    "nomos_name": "Κοζάνης",
    "dimos_name": "Εορδαίας"
  },
  {
    "periferies_name": "Δυτικής Μακεδονίας",
    "nomos_name": "Κοζάνης",
    "dimos_name": "Κοζάνης"
  },
  {
    "periferies_name": "Δυτικής Μακεδονίας",
    "nomos_name": "Κοζάνης",
    "dimos_name": "Σερβίων - Βελβεντού"
  },
  {
    "periferies_name": "Δυτικής Μακεδονίας",
    "nomos_name": "Φλώρινας",
    "dimos_name": "Αμυνταίου"
  },
  {
    "periferies_name": "Δυτικής Μακεδονίας",
    "nomos_name": "Φλώρινας",
    "dimos_name": "Πρεσπών"
  },
  {
    "periferies_name": "Δυτικής Μακεδονίας",
    "nomos_name": "Φλώρινας",
    "dimos_name": "Φλώρινας"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Άρτας",
    "dimos_name": "Αρταίων"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Άρτας",
    "dimos_name": "Γεωργίου Καραϊσκάκη"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Άρτας",
    "dimos_name": "Κεντρικών Τζουμέρκων"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Άρτας",
    "dimos_name": "Νικολάου Σκουφά"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Θεσπρωτίας",
    "dimos_name": "Ηγουμενίτσας"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Θεσπρωτίας",
    "dimos_name": "Σουλίου"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Θεσπρωτίας",
    "dimos_name": "Φιλιατών"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Ιωαννίνων",
    "dimos_name": "Βορείων Τζουμέρκων"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Ιωαννίνων",
    "dimos_name": "Δωδώνης"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Ιωαννίνων",
    "dimos_name": "Ζαγορίου"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Ιωαννίνων",
    "dimos_name": "Ζίτσας"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Ιωαννίνων",
    "dimos_name": "Ιωαννιτών"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Ιωαννίνων",
    "dimos_name": "Κόνιτσας"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Ιωαννίνων",
    "dimos_name": "Μετσόβου"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Ιωαννίνων",
    "dimos_name": "Πωγωνίου"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Πρέβεζας",
    "dimos_name": "Ζηρού"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Πρέβεζας",
    "dimos_name": "Πάργας"
  },
  {
    "periferies_name": "Ηπείρου",
    "nomos_name": "Πρέβεζας",
    "dimos_name": "Πρέβεζας"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Καρδίτσας",
    "dimos_name": "Αργιθέας"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Καρδίτσας",
    "dimos_name": "Καρδίτσας"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Καρδίτσας",
    "dimos_name": "Λίμνης Πλαστήρα"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Καρδίτσας",
    "dimos_name": "Μουζακίου"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Καρδίτσας",
    "dimos_name": "Παλαμά"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Λάρισας",
    "dimos_name": "Αγιάς"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Λάρισας",
    "dimos_name": "Ελασσόνας"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Λάρισας",
    "dimos_name": "Κιλελέρ"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Λάρισας",
    "dimos_name": "Λαρισαίων"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Λάρισας",
    "dimos_name": "Τεμπών"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Λάρισας",
    "dimos_name": "Τυρνάβου"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Λάρισας",
    "dimos_name": "Φαρσάλων"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Μαγνησίας",
    "dimos_name": "Αλμυρού"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Μαγνησίας",
    "dimos_name": "Βόλου"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Μαγνησίας",
    "dimos_name": "Ζαγοράς - Μουρεσίου"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Μαγνησίας",
    "dimos_name": "Νοτίου Πηλίου"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Μαγνησίας",
    "dimos_name": "Ρήγα Φερραίου"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Μαγνησίας",
    "dimos_name": "Αλοννήσου"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Μαγνησίας",
    "dimos_name": "Σκιάθου"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Μαγνησίας",
    "dimos_name": "Σκοπέλου"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Τρικάλων",
    "dimos_name": "Καλαμπάκας"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Τρικάλων",
    "dimos_name": "Πύλης"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Τρικάλων",
    "dimos_name": "Τρικκαίων"
  },
  {
    "periferies_name": "Θεσσαλίας",
    "nomos_name": "Τρικάλων",
    "dimos_name": "Φαρκαδόνας"
  },
  {
    "periferies_name": "Ιονίων Νήσων",
    "nomos_name": "Ζακύνθου",
    "dimos_name": "Ζακύνθου"
  },
  {
    "periferies_name": "Ιονίων Νήσων",
    "nomos_name": "Κέρκυρας",
    "dimos_name": "Κέρκυρας"
  },
  {
    "periferies_name": "Ιονίων Νήσων",
    "nomos_name": "Κέρκυρας",
    "dimos_name": "Παξών"
  },
  {
    "periferies_name": "Ιονίων Νήσων",
    "nomos_name": "Κεφαλληνίας",
    "dimos_name": "Κεφαλονιάς"
  },
  {
    "periferies_name": "Ιονίων Νήσων",
    "nomos_name": "Κεφαλληνίας",
    "dimos_name": "Ιθάκης"
  },
  {
    "periferies_name": "Ιονίων Νήσων",
    "nomos_name": "Λευκάδας",
    "dimos_name": "Λευκάδος"
  },
  {
    "periferies_name": "Ιονίων Νήσων",
    "nomos_name": "Λευκάδας",
    "dimos_name": "Μεγανησίου"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Αιτωλοακαρνανίας",
    "dimos_name": "Αγρινίου"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Αιτωλοακαρνανίας",
    "dimos_name": "Άκτιου - Βόνιτσας"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Αιτωλοακαρνανίας",
    "dimos_name": "Αμφιλοχίας"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Αιτωλοακαρνανίας",
    "dimos_name": "Θέρμου"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Αιτωλοακαρνανίας",
    "dimos_name": "Ιεράς Πόλης Μεσολογγίου"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Αιτωλοακαρνανίας",
    "dimos_name": "Ναυπακτίας"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Αιτωλοακαρνανίας",
    "dimos_name": "Ξηρομέρου"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Αχαΐας",
    "dimos_name": "Αιγιαλείας"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Αχαΐας",
    "dimos_name": "Δυτικής Αχαΐας"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Αχαΐας",
    "dimos_name": "Ερυμάνθου"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Αχαΐας",
    "dimos_name": "Καλαβρύτων"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Αχαΐας",
    "dimos_name": "Πατρέων"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Ηλείας",
    "dimos_name": "Ανδραβίδας - Κυλλήνης"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Ηλείας",
    "dimos_name": "Ανδρίτσαινας - Κρεστένων"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Ηλείας",
    "dimos_name": "Αρχαίας Ολυμπίας"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Ηλείας",
    "dimos_name": "Ζαχάρως"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Ηλείας",
    "dimos_name": "Ήλιδας"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Ηλείας",
    "dimos_name": "Πηνειού"
  },
  {
    "periferies_name": "Δυτικής Ελλάδας",
    "nomos_name": "Ηλείας",
    "dimos_name": "Πύργου"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Βοιωτίας",
    "dimos_name": "Αλιάρτου - Θεσπιέων"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Βοιωτίας",
    "dimos_name": "Διστόμου-Αράχοβας - Αντίκυρας"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Βοιωτίας",
    "dimos_name": "Θηβαίων"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Βοιωτίας",
    "dimos_name": "Λεβαδέων"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Βοιωτίας",
    "dimos_name": "Ορχομενού"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Βοιωτίας",
    "dimos_name": "Τανάγρας"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Εύβοιας",
    "dimos_name": "Διρφύων - Μεσσαπίων"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Εύβοιας",
    "dimos_name": "Ερέτριας"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Εύβοιας",
    "dimos_name": "Ιστιαίας - Αιδηψού"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Εύβοιας",
    "dimos_name": "Καρύστου"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Εύβοιας",
    "dimos_name": "Κύμης - Αλιβερίου"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Εύβοιας",
    "dimos_name": "Μαντουδίου - Λίμνης - Αγίας Άννας"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Εύβοιας",
    "dimos_name": "Σκύρου"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Εύβοιας",
    "dimos_name": "Χαλκιδέων"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Ευρυτανίας",
    "dimos_name": "Καρπενησίου"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Ευρυτανίας",
    "dimos_name": "Αγράφων"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Φθιώτιδος",
    "dimos_name": "Μώλου - Αγίου Κωνσταντίνου"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Φθιώτιδος",
    "dimos_name": "Αμφίκλειας - Ελάτειας"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Φθιώτιδος",
    "dimos_name": "Λοκρών"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Φθιώτιδος",
    "dimos_name": "Δομοκού"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Φθιώτιδος",
    "dimos_name": "Λαμιέων"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Φθιώτιδος",
    "dimos_name": "Μακρακώμης"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Φθιώτιδος",
    "dimos_name": "Στυλίδος"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Φωκίδας",
    "dimos_name": "Δελφών"
  },
  {
    "periferies_name": "Στερεάς Ελλάδας",
    "nomos_name": "Φωκίδας",
    "dimos_name": "Δωρίδος"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Βορείου Τομέα Αθηνών",
    "dimos_name": "Αγίας Παρασκευής"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Βορείου Τομέα Αθηνών",
    "dimos_name": "Αμαρουσίου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Βορείου Τομέα Αθηνών",
    "dimos_name": "Βριλησσίων"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Βορείου Τομέα Αθηνών",
    "dimos_name": "Ηρακλείου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Βορείου Τομέα Αθηνών",
    "dimos_name": "Κηφισιάς"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Βορείου Τομέα Αθηνών",
    "dimos_name": "Λυκόβρυσης - Πεύκης"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Βορείου Τομέα Αθηνών",
    "dimos_name": "Μεταμορφώσεως"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Βορείου Τομέα Αθηνών",
    "dimos_name": "Ιωνίας"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Βορείου Τομέα Αθηνών",
    "dimos_name": "Παπάγου - Χαλαργού"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Βορείου Τομέα Αθηνών",
    "dimos_name": "Πεντέλης"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Βορείου Τομέα Αθηνών",
    "dimos_name": "Ψυχικού"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Βορείου Τομέα Αθηνών",
    "dimos_name": "Χαλανδρίου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Δυτικού Τομέα Αθηνών",
    "dimos_name": "Αγίας Βαρβάρας"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Δυτικού Τομέα Αθηνών",
    "dimos_name": "Αγίων Αναργύρων - Καματερού"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Δυτικού Τομέα Αθηνών",
    "dimos_name": "Αιγάλεω"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Δυτικού Τομέα Αθηνών",
    "dimos_name": "Ιλίου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Δυτικού Τομέα Αθηνών",
    "dimos_name": "Περιστερίου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Δυτικού Τομέα Αθηνών",
    "dimos_name": "Χαϊδαρίου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Κεντρικού Τομέα Αθηνών",
    "dimos_name": "Αθηναίων"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Κεντρικού Τομέα Αθηνών",
    "dimos_name": "Βύρωνος"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Κεντρικού Τομέα Αθηνών",
    "dimos_name": "Γαλατσίου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Κεντρικού Τομέα Αθηνών",
    "dimos_name": "Δάφνης - Υμηττού"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Κεντρικού Τομέα Αθηνών",
    "dimos_name": "Ζωγράφου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Κεντρικού Τομέα Αθηνών",
    "dimos_name": "Ηλιουπόλεως"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Κεντρικού Τομέα Αθηνών",
    "dimos_name": "Καισαριανής"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Κεντρικού Τομέα Αθηνών",
    "dimos_name": "Φιλαδέλφειας - Χαλκηδόνος"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Νοτίου Τομέα Αθηνών",
    "dimos_name": "Αγίου Δημητρίου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Νοτίου Τομέα Αθηνών",
    "dimos_name": "Αλίμου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Νοτίου Τομέα Αθηνών",
    "dimos_name": "Γλυφάδας"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Νοτίου Τομέα Αθηνών",
    "dimos_name": "Ελληνικού - Αργυρούπολης"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Νοτίου Τομέα Αθηνών",
    "dimos_name": "Καλλιθέας"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Νοτίου Τομέα Αθηνών",
    "dimos_name": "Μοσχάτου - Ταύρου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Νοτίου Τομέα Αθηνών",
    "dimos_name": "Νέας Σμύρνης"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Νοτίου Τομέα Αθηνών",
    "dimos_name": "Παλαιού Φαλήρου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Ανατολικής Αττικής",
    "dimos_name": "Αχαρνών"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Ανατολικής Αττικής",
    "dimos_name": "Βάρης - Βούλας - Βουλιαγμένης"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Ανατολικής Αττικής",
    "dimos_name": "Διονύσου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Ανατολικής Αττικής",
    "dimos_name": "Κρωπίας"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Ανατολικής Αττικής",
    "dimos_name": "Λαυρεωτικής"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Ανατολικής Αττικής",
    "dimos_name": "Μαραθώνος"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Ανατολικής Αττικής",
    "dimos_name": "Μαρκοπούλου Μεσογαίας"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Ανατολικής Αττικής",
    "dimos_name": "Παιανίας"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Ανατολικής Αττικής",
    "dimos_name": "Παλλήνης"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Ανατολικής Αττικής",
    "dimos_name": "Ραφήνας - Πικερμίου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Ανατολικής Αττικής",
    "dimos_name": "Σαρωνικού"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Ανατολικής Αττικής",
    "dimos_name": "Σπάτων - Αρτέμιδος"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Ανατολικής Αττικής",
    "dimos_name": "Ωρωπού"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Δυτικής Αττικής",
    "dimos_name": "Ασπροπύργου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Δυτικής Αττικής",
    "dimos_name": "Ελευσίνας"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Δυτικής Αττικής",
    "dimos_name": "Μάνδρας - Ειδυλλίας"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Δυτικής Αττικής",
    "dimos_name": "Μεγαρέων"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Δυτικής Αττικής",
    "dimos_name": "Φυλής"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Πειραιώς",
    "dimos_name": "Κερατσινίου - Δραπετσώνας"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Πειραιώς",
    "dimos_name": "Κορυδαλλού"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Πειραιώς",
    "dimos_name": "Νικαίας - Αγίου Ιωάννου Ρέντη"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Πειραιώς",
    "dimos_name": "Πειραιώς"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Πειραιώς",
    "dimos_name": "Περάματος"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Νήσων",
    "dimos_name": "Αγκιστρίου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Νήσων",
    "dimos_name": "Αίγινας"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Νήσων",
    "dimos_name": "Κυθήρων"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Νήσων",
    "dimos_name": "Πόρου"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Νήσων",
    "dimos_name": "Σαλαμίνας"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Νήσων",
    "dimos_name": "Σπετσών"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Νήσων",
    "dimos_name": "Τροιζηνίας - Μεθάνων"
  },
  {
    "periferies_name": "Αττικής",
    "nomos_name": "Αττικής-Νήσων",
    "dimos_name": "Ύδρας"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Αργολίδας",
    "dimos_name": "Άργους - Μυκηνών"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Αργολίδας",
    "dimos_name": "Επιδαύρου"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Αργολίδας",
    "dimos_name": "Ερμιονίδας"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Αργολίδας",
    "dimos_name": "Ναυπλιέων"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Αρκαδίας",
    "dimos_name": "Βόρειας Κυνουρίας"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Αρκαδίας",
    "dimos_name": "Γόρτυνος"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Αρκαδίας",
    "dimos_name": "Μεγαλόπολης"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Αρκαδίας",
    "dimos_name": "Νότιας Κυνουρίας"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Αρκαδίας",
    "dimos_name": "Τρίπολης"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Κορινθίας",
    "dimos_name": "Βέλου - Βόχας"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Κορινθίας",
    "dimos_name": "Κορινθίων"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Κορινθίας",
    "dimos_name": "Λουτρακίου - Περαχώρας - Αγ. Θεοδώρων"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Κορινθίας",
    "dimos_name": "Νεμέας"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Κορινθίας",
    "dimos_name": "Ξυλοκάστρου - Ευρωστίνης"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Κορινθίας",
    "dimos_name": "Σικυωνίων"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Λακωνίας",
    "dimos_name": "Ανατολικής Μάνης"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Λακωνίας",
    "dimos_name": "Ελαφονήσου"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Λακωνίας",
    "dimos_name": "Ευρώτα"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Λακωνίας",
    "dimos_name": "Μονεμβασίας"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Λακωνίας",
    "dimos_name": "Σπάρτης"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Μεσσηνίας",
    "dimos_name": "Μάνης"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Μεσσηνίας",
    "dimos_name": "Καλαμάτας"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Μεσσηνίας",
    "dimos_name": "Μεσσήνης"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Μεσσηνίας",
    "dimos_name": "Οιχαλίας"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Μεσσηνίας",
    "dimos_name": "Πύλου - Νέστορος"
  },
  {
    "periferies_name": "Πελοποννήσου",
    "nomos_name": "Μεσσηνίας",
    "dimos_name": "Τριφυλίας"
  },
  {
    "periferies_name": "Βορείου Αιγαίου",
    "nomos_name": "Λέσβου",
    "dimos_name": "Λέσβου"
  },
  {
    "periferies_name": "Βορείου Αιγαίου",
    "nomos_name": "Λέσβου",
    "dimos_name": "Ευστρατίου"
  },
  {
    "periferies_name": "Βορείου Αιγαίου",
    "nomos_name": "Λέσβου",
    "dimos_name": "Λήμνου"
  },
  {
    "periferies_name": "Βορείου Αιγαίου",
    "nomos_name": "Σάμου",
    "dimos_name": "Σάμου"
  },
  {
    "periferies_name": "Βορείου Αιγαίου",
    "nomos_name": "Σάμου",
    "dimos_name": "Ικαρίας"
  },
  {
    "periferies_name": "Βορείου Αιγαίου",
    "nomos_name": "Σάμου",
    "dimos_name": "Κορσέων"
  },
  {
    "periferies_name": "Βορείου Αιγαίου",
    "nomos_name": "Χίου",
    "dimos_name": "Οινουσσών"
  },
  {
    "periferies_name": "Βορείου Αιγαίου",
    "nomos_name": "Χίου",
    "dimos_name": "Χίου"
  },
  {
    "periferies_name": "Βορείου Αιγαίου",
    "nomos_name": "Χίου",
    "dimos_name": "Ψαρών"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Άνδρου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Ανάφης"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Θήρας"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Ιητών"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Σικίνου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Φολεγάνδρου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Κέας"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Κύθνου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Κιμώλου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Μήλου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Σερίφου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Σίφνου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Μυκόνου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Αμοργού"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Κυκλάδων"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Αντιπάρου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Πάρου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Ερμούπολης"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Κυκλάδων",
    "dimos_name": "Τήνου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Δωδεκανήσου",
    "dimos_name": "Αγαθονησίου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Δωδεκανήσου",
    "dimos_name": "Αστυπάλαιας"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Δωδεκανήσου",
    "dimos_name": "Καλυμνίων"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Δωδεκανήσου",
    "dimos_name": "Καρπάθου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Δωδεκανήσου",
    "dimos_name": "Κάσου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Δωδεκανήσου",
    "dimos_name": "Λειψών"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Δωδεκανήσου",
    "dimos_name": "Λέρου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Δωδεκανήσου",
    "dimos_name": "Πάτμου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Δωδεκανήσου",
    "dimos_name": "Κώ"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Δωδεκανήσου",
    "dimos_name": "Νισύρου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Δωδεκανήσου",
    "dimos_name": "Μεγίστης"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Δωδεκανήσου",
    "dimos_name": "Ρόδου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Δωδεκανήσου",
    "dimos_name": "Σύμης"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Δωδεκανήσου",
    "dimos_name": "Τήλου"
  },
  {
    "periferies_name": "Νοτίου Αιγαίου",
    "nomos_name": "Δωδεκανήσου",
    "dimos_name": "Χάλκης"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Ηρακλείου",
    "dimos_name": "Αστερουσίων"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Ηρακλείου",
    "dimos_name": "Βιάννου"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Ηρακλείου",
    "dimos_name": "Γόρτυνας"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Ηρακλείου",
    "dimos_name": "Ηρακλείου - Κρήτης"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Ηρακλείου",
    "dimos_name": "Μαλεβιζίου"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Ηρακλείου",
    "dimos_name": "Πεδιάδας"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Ηρακλείου",
    "dimos_name": "Φαιστού"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Ηρακλείου",
    "dimos_name": "Χερσονήσου"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Λασιθίου",
    "dimos_name": "Νικολάου"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Λασιθίου",
    "dimos_name": "Ιεράπετρας"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Λασιθίου",
    "dimos_name": "Λασιθίου"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Λασιθίου",
    "dimos_name": "Σητείας"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Ρεθύμνης",
    "dimos_name": "Βασιλείου"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Ρεθύμνης",
    "dimos_name": "Αμαρίου"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Ρεθύμνης",
    "dimos_name": "Ανωγείων"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Ρεθύμνης",
    "dimos_name": "Μυλοποτάμου"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Ρεθύμνης",
    "dimos_name": "Ρεθύμνης"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Χανίων",
    "dimos_name": "Αποκορώνου"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Χανίων",
    "dimos_name": "Γαύδου"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Χανίων",
    "dimos_name": "Σέλινου"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Χανίων",
    "dimos_name": "Κισσάμου"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Χανίων",
    "dimos_name": "Πλατανιά"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Χανίων",
    "dimos_name": "Σφακίων"
  },
  {
    "periferies_name": "Κρήτης",
    "nomos_name": "Χανίων",
    "dimos_name": "Χανίων"
  }
];

module.exports = greeceMunicipalities;
