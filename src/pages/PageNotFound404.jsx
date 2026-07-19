
export default function pagenotfound404() {
  return (
    <div><h1>404 - Page Not Found</h1>
    <button className="btn btn-outline-primary" onClick={() => window.history.back()}>Go Back</button>
    </div>
  )
}
