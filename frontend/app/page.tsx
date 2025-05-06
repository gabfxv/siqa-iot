import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  const cookieStore = cookies();
  const session = cookieStore.get('session');

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}