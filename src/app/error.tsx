"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (<div className="wrap py-32"><h1 className="display text-6xl">Something slipped.</h1><p className="mt-4 text-mute">An unexpected error occurred. Your cart is saved on this device.</p><button className="btn btn-solid mt-8" onClick={reset}>Try again</button></div>);
}
