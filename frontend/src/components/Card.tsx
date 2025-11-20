
import type { ReactNode } from "react"

type Card = {
    children?: ReactNode
}

function Card({ children }: Card) {

  return (
    <>
        <div className = "Card bg-white p-6 rounded-lg shadow-md">
            {children}
        </div>
    </>
  )
}

export default Card