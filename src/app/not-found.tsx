import Link from "next/link";
export default function NotFound() {
  return (<div className="wrap py-32"><p className="label text-mute">404</p><h1 className="display mt-2 text-7xl">Not in the Locker.</h1><Link href="/shop" className="btn btn-solid mt-8">Back to shopping</Link></div>);
}
