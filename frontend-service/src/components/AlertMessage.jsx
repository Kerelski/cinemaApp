export function AlertMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="alert" role="alert">
      {message}
    </div>
  );
}
