import {CircularProgressbar,buildStyles}from 'react-circular-progressbar'
import { useBudget } from "../hooks/useBudget";
import AmountDisplay from "./AmountDisplay";
import "react-circular-progressbar/dist/styles.css"

export default function BudgetTracker() {
    const {state,totalExpenses,remainingBudget,dispatch}= useBudget()
    const percentage = +((totalExpenses/state.budget)*100).toFixed(2)
    return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex justify-center">
        <CircularProgressbar
      value={percentage}
      text={`${percentage}%`}
      styles={buildStyles({
        pathColor: percentage < 50
          ? "#10b981" // Verde
          : percentage < 75
          ? "#facc15" // Amarillo
          : 
          "#f87171", //verde
        trailColor: "#f5f5f5",
        textColor: percentage < 50
          ? "#10b981" // Verde
          : percentage < 75
          ? "#facc15" // Amarillo
          : "#f87171" // Rojo 
         
      })}
    />
        </div>

        <div  className="flex flex-col justify-center items-center gap-8">
            <button 
                type ="button"
                className="bg-pink-600 w-full p-2 text-white uppercase font-bold"
                onClick={()=>dispatch({type:'reset-app'})}
            >
                restear app
            </button>

            <AmountDisplay
                label="Presupuesto"
                amount={state.budget}
            />
             <AmountDisplay
                label="disponible"
                amount={remainingBudget}
            />
             <AmountDisplay
                label="gastado"
                amount={totalExpenses}
            />
        </div>
    </div>
  )
}