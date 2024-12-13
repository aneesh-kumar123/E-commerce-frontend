import Link from 'next/link'; 

export default function Footer() {
  return (
    <footer className="bg-red-600 text-white p-4 mt-8">
      <div className="max-w-screen-xl mx-auto text-center">
        <p>&copy; 2024 AreSports. All Rights Reserved.</p>
        <div className="space-x-4 mt-2">
          <Link href="/privacy-policy" className="hover:text-gold">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gold">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}