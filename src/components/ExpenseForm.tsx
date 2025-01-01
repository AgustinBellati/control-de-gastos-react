import { ChangeEvent, useEffect, useState } from "react";
import type { DraftExpense, Value } from "../types";
import { categories } from "../data/categories";
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import  'react-calendar/dist/Calendar.css';
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {

    const [expense,SetExpense]=useState<DraftExpense>({
        amount:0,
        expenseName:'',
        category:'',
        date: new Date()
    })

    const [error,setError]=useState('')
    const [previusAmount,setPreviusAmount]=useState(0)
    const {dispatch,state,remainingBudget}= useBudget()

    useEffect(() =>{
        if(state.editingId){
            const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]
            SetExpense(editingExpense)
            setPreviusAmount(editingExpense.amount)
        }
    },[state.editingId])


    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
    
        const isAmountField =['amount'].includes(name)
    
        SetExpense({
            ...expense,
            [name]: isAmountField ? Number(value) : value,
        });
    };


    const handleChangeDate=(value:Value)=>{
        SetExpense({
            ...expense,
            date:value
        })
    }

    const handleSubmit =(e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        //validar
        if(Object.values(expense).includes('')){
            setError('Todos los campos son obligatorios')
            return
        }
        //validar que no me pase del presupuesto
        if((expense.amount- previusAmount) > remainingBudget){
            setError('Ese gasto se sale del presupuesto')
            return
        }
       //agregar o actualizar el gasto
       if(state.editingId){
            dispatch({type:'update-expense',payload:{expense:{id:state.editingId,...expense}}})
       }else{
           dispatch({type:'add-expense',payload:{expense}})
       }
       //reiniciar el state
       SetExpense({
        amount:0,
        expenseName:'',
        category:'',
        date: new Date()
       })
       setPreviusAmount(0)

    }
  return (
    <form action="" onSubmit={handleSubmit} className="space-y-5">
        <legend
            className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2"
        >
           {state.editingId ? 'Guardar cambios' : 'Nuevo Gasto'}
        </legend>
        {error && <ErrorMessage>{error}</ErrorMessage> }

        <div className="flex flex-col gap-2"> 
            <label  htmlFor="expenseName" className="text-xl" > Nombre gasto: </label>
            <input 
                type="text" 
                id="expenseName" 
                placeholder="nombre del gasto" 
                className="bg-slate-100" 
                name="expenseName" 
                value={expense.expenseName}
                onChange={handleChange}
            />
        </div>

        <div className="flex flex-col gap-2"> 
            <label  htmlFor="amount" className="text-xl" > Cantidad </label>
            <input 
                type="number" 
                id="amount"
                placeholder="$$$" 
                className="bg-slate-100" 
                name="amount"
                value={expense.amount}
                onChange={handleChange}
            />
        </div>

        <div className="flex flex-col gap-2"> 
            <label  htmlFor="category" className="text-xl" > Categoria </label>
            <select
                name="category"
                id="category"
                value={expense.category}
                onChange={handleChange}
              >
                <option value="">--Seleccione--</option>
                {categories.map(category =>(<option key={category.id} value={category.id} >{category.name}</option>))}
             

            </select>
        </div>

        <div className="flex flex-col gap-2"> 
            <label  htmlFor="amount" className="text-xl" > Fecha </label>
            <DatePicker
                className="bg-slate-100 p-2 border-0"
                value={expense.date}
                onChange={handleChangeDate}
            />
        </div>
        <input type="submit" className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
            value={state.editingId ? 'Actualizar' : 'Ingresar'}

        />

    </form>
  )
}
