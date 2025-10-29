const form=document.getElementById('incomeExpenseCalculator');
const filterForm = document.getElementById('filterForm');
const incomeValue=document.getElementById('income');
const categoryValue=document.getElementById('category');
const expenseDescriptionValue=document.getElementById('expenseDescription');
const amountValue=document.getElementById('amount');
const submitBtn=document.getElementById('submitBtn');
const resetBtn=document.getElementById('resetBtn');
const tableBody=document.getElementById('incomeTable');
const searchBtn=document.getElementById('searchBtn');




let lists=[];
let listAmount = [];
let listIncome = [];
let listExpense = [];
let editId = null;



// Load the list in the localstorage
async function loadlists(){
    const storeLists = localStorage.getItem('lists');
    if(storeLists){
        lists=JSON.parse(storeLists);
    }
    else{
        console.log('Loading from Lists')
        lists.slice(0,10)
        localStorage.setItem('lists',JSON.stringify(lists));
    }
    renderTable()
}

// Render and display all the data in table format
function renderTable(){
    const selectedRadio = document.querySelector('input[name="filterType"]:checked');
    const selectedValue = selectedRadio ? selectedRadio.value : 'all';


    let totalIncome = 0;
    let totalExpense = 0;
    let netAmount = 0;
    tableBody.innerHTML = ""
    lists.forEach((list) => {
         if (selectedValue === 'all' || selectedValue === list.category) {
            if((selectedValue === 'income') || (selectedValue === 'expense') || (selectedValue === 'all')){
                if(list.category == 'income'){totalIncome +=Number(list.amount);netAmount +=Number(list.amount)}
                if(list.category == 'expense'){totalExpense +=Number(list.amount);netAmount +=Number(list.amount)}
                else{console.log(totalIncome + totalExpense);netAmount = totalIncome + totalExpense;}
            }
            
            
            const row=`
                <tr>
                    <td>${list.id}</td>
                    <td>${list.category}</td>
                    <td>${list.income}</td>
                    <td>${list.expenseDescription}</td>
                    <td>${list.amount}</td>
                    <td>
                        <button class="action-btn edit-btn" onClick="editList(${list.id})">Edit</button>
                        <button class="action-btn delete-btn" onClick="deleteList(${list.id})">Delete</button>
                    </td>
                </tr>
            `
            tableBody.innerHTML += row
         }
    })

    document.getElementById('totalIncome').textContent='Total Income:'+ totalIncome
    document.getElementById('totalExpense').textContent='Total Expense:'+ totalExpense
    document.getElementById('netAmount').textContent='Net Amount:'+ netAmount
}

// Event listener for radio buttons
filterForm.addEventListener('change', renderTable);

// Prevent form submission on reset and clear selection
resetBtn.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelectorAll('input[name="filterType"]').forEach(radio => radio.checked = false);
    renderTable();
});



// Adding the value into the list
submitBtn.addEventListener('click',(e)=>{
    e.preventDefault();

  
    const income=incomeValue.value.trim()
    const expenseDescription=expenseDescriptionValue.value.trim()
    const category=categoryValue.value.trim()
    const amount=amountValue.value.trim()

    if(!category || !amount){
        alert('Category and Amount is Mandatory fields')
        return
    }

    if(editId){
        const list = lists.find((l)=>l.id === editId)
        list.income = income
        list.category = category
        list.expenseDescription = expenseDescription
        list.amount = amount
        editId = null
        submitBtn.textContent="Add To List"
    }
    else{
        const newList = {
            id:lists.length ? lists.length + 1:1,
            category,
            income,
            expenseDescription,
            amount
        }
        lists.push(newList)
        alert('Add Into List')
    }

    saveToLocalStorage()
    renderTable()
    form.reset();
        
})

// Save into local storage
function saveToLocalStorage(){
    localStorage.setItem('lists',JSON.stringify(lists))
}

// Edit into the input list
function editList(id) {
    const list = lists.find((l) => l.id === Number(id))
    if(!list){return;}
    categoryValue.value = list.category
    incomeValue.value = list.income
    expenseDescriptionValue.value = list.expenseDescription
    amountValue.value = list.amount
    editId = id
    submitBtn.textContent = "Update List"
}

// Delete based on the id
function deleteList(id){
     if (confirm("Are you sure you want to delete this list?")) {
        lists = lists.filter((l) => l.id !== id)
        saveToLocalStorage()
        renderTable()
        alert('list Deleted')
    }
}
// Call the function to list the data
loadlists();