export default function Loading() {
  return (<div className="wrap py-12" aria-busy="true"><div className="skel h-24 w-2/3" /><div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <div key={i} className="skel aspect-[5/4]" />)}</div></div>);
}
