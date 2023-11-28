import Link from 'next/link';
import {buttonVariants} from '@/components/ui/button';
import {useSelector} from 'react-redux';
import {selectIsAuthenticated} from '@/store/authSlice';

export default function About() {
  const isAuthenticated = useSelector(selectIsAuthenticated);


  return (
    <div>

    <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
      Dashboard
    </h1>



    <h1>Hello, Dashboard Page!</h1>

    <Link
      href="/dashboard/settings"
      rel="noreferrer"
      className={buttonVariants()}
    >
      About
    </Link>
  </div>
  )
}
