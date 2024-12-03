// Seleciona os elementos do formulário
const form = document.querySelector('form');
const expense = document.querySelector('#expense');
const amount = document.querySelector('#amount');
const category = document.querySelector('#category');

// Seleciona os elementos da lista
const expenseList = document.querySelector('ul');
const expensesQuantity = document.querySelector('aside header p span');
const expensesTotal = document.querySelector('aside header h2');

// Captura o evento de input para formatar o valor
amount.oninput = function () {
  let value = amount.value.replace(/\D/g, '');

  value = Number(value) / 100;

  amount.value = formatCurrencyBRL(value);
}

// Função para formatar o valor em moeda BRL
function formatCurrencyBRL(value) {
  value = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return value;
}

// Captura o evento de submit do formulário para obter os valores
form.onsubmit = function (event) {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date()
  }

  expenseAdd(newExpense);
}

// Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    // Cria o item da despesa
    const expenseItem = document.createElement('li');
    expenseItem.classList.add('expense');

    // Cria o ícone da despesa  
    const expenseIcon = document.createElement('img');
    expenseIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // Cria a div com as informações da despesa
    const expenseInfo = document.createElement('div');
    expenseInfo.classList.add('expense-info');

    // Cria o nome da despesa
    const expenseName = document.createElement('strong');
    expenseName.textContent = newExpense.expense;

    // Cria a categoria da despesa
    const expenseCategory = document.createElement('span');
    expenseCategory.textContent = newExpense.category_name;

    expenseInfo.append(expenseName, expenseCategory);

    // Cria o valor da despesa
    const expenseAmount = document.createElement('span');
    expenseAmount.classList.add('expense-amount');
    expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount.toUpperCase().replace('R$', '')}`;

    // Cria o ícone de remoção da despesa
    const removeIcon = document.createElement('img');
    removeIcon.classList.add('remove-icon');
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover despesa");

    // Adiciona os elementos
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);
    expenseList.append(expenseItem);

    updateTotals();
    clearForm();

  } catch (error) {
    alert('Não foi possível atualizar a lista de despesas');
    console.log(error)
  }
}

// Atualiza os totais
function updateTotals() {
  try {
    // Recupera todos os itens da lista
    const items = expenseList.children;
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`;


    let total = 0;
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector('.expense-amount');

      // Remover caracteres não numéricos e substitui a vírgula por ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, '').replace(",", ".");
      console.log(value)

      // Converte o valor para float
      value = parseFloat(value);

      // Verifica se é um número válido
      if (isNaN(value)) {
        return alert('Não foi possível calcular o total. O valor não parece ser um número');
      }

      total += Number(value);
    }

    // Cria a span para adicionar o R$ formatado
    const symbolBRL = document.createElement('small');
    symbolBRL.textContent = 'R$';

    total = formatCurrencyBRL(total).toUpperCase().replace('R$', '');

    expensesTotal.innerHTML = '';
    expensesTotal.append(symbolBRL, total);

  } catch (error) {
    console.log(error)
    alert('Não foi possível atualizar o total de despesas');
  }
}

// Evento que captura o clique nos itens da lista
expenseList.addEventListener('click', function (event) {
  const target = event.target;

  if (target.classList.contains('remove-icon')) {
    target.parentElement.remove();
    updateTotals();
  }
});

function clearForm() {
  expense.value = '';
  amount.value = '';
  category.value = '';

  expense.focus();
}
