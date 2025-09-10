function ExpenseItem() {
  return (
    <>
      <div className="flex flex-row items-center justify-center  ">
        <div className="flex flex-row justify-between px-5 w-sm py-1.5 bg-amber-400 items-center">
          <div className="flex flex-row items-center justify-between gap-4">
            <span class="material-symbols-outlined">payments</span>
            <div>
              <h1 className="font-bold">Title</h1>
              <div className="flex flex-row gap-1 text-sm ">
                <p>Category</p>
                <p>-</p>
                <p>Date</p>
              </div>
            </div>
          </div>
          <p>Amount</p>
        </div>
      </div>
    </>
  );
}
export default ExpenseItem;
