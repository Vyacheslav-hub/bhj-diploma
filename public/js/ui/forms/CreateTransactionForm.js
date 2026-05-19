/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list({}, (err, response) => {
      if (response && response.success) {
        const select = this.element.querySelector('.accounts-select');

        let option = ''
        response.data.forEach(({id, name}) => {
          option += `<option value="${id}">${name}</option>`;
        });

        select.innerHTML = option;
      }
    })
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response && response.success) {
        this.element.reset();

        App.update();

        if (this.element.id === 'new-income-form') {
          App.getModal('newIncome').close();
        }else {
          App.getModal('newExpense').close();
        }
      }
    })
  }
}
