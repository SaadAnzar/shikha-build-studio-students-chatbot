import { HashLoader } from "react-spinners"

const Loader = () => {
  return (
    <div className="sweet-loading z-50 flex h-[85vh] flex-col items-center justify-center gap-y-6">
      <HashLoader
        color="#000"
        size={100}
        aria-label="Hash Loader"
        data-testid="loader"
        speedMultiplier={1.3}
      />
    </div>
  )
}

export default Loader
