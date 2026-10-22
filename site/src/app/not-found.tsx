import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container narrow" style={{ padding: "64px 16px" }}>
      <h1>Page not found</h1>
      <p className="lede">That page doesn&apos;t exist or has moved.</p>
      <p>
        <Link className="btn btn-brand" href="/">
          Go home
        </Link>{" "}
        <Link className="btn btn-ghost" href="/search">
          Search
        </Link>
      </p>
    </div>
  );
}
