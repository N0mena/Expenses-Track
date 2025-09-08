
function ExpenseItem({ expense }) {
  return (
    <>
      <div className="flex flex-row items-center justify-center  ">
        <div className="flex flex-row justify-between px-5 w-sm py-1.5 bg-amber-400 items-center">
          <div className="flex flex-row items-center justify-between gap-4">
            <span class="material-symbols-outlined"></span>
            <div>
              <h1 className="font-bold">{expense.title}</h1>
              <div className="flex flex-row gap-1 text-sm ">
                <p>{expense.category}</p>
                <p>-</p>
                <p>{expense.date}</p>
              </div>
            </div>
          </div>
          <p>{expense.amount}</p>
        </div>
      </div>
    </>
  );
}
export default ExpenseItem;
