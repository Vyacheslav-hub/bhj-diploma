/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) throw new Error('Не передан элемент')
    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      if (e.target.closest('.create-account')) {
        App.getModal('createAccount').open();
        return;
      }

      const account = e.target.closest('.account')
      if (account) {
        this.onSelectAccount(account);
      }
    })
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItems()
   * */
  update() {
  if (User.current()) {
    Account.list((err, response) => {
      if (response && response.success) {
        this.clear();
        this.renderItems(response.data)
      }
    })
  }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    this.element.querySelectorAll('.account').forEach(el => el.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const accountActive = this.element.querySelector('.account.active');
    if (accountActive) {
      accountActive.classList.remove('active');
    }
    element.classList.add('active');
    const id = element.dataset.id;
    App.showPage('transactions', { account_id: id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    const {
      name,
      sum,
      id
    } = item;
    const sumString = Number(sum).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `<li class="account" data-id="${id}"><a href="#"><span>${name}</span><span>${sumString}</span></a></li>`
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItems(data){
    let html = '';

    data.forEach(item => {
      html += this.getAccountHTML(item);
    });

    this.element.insertAdjacentHTML('beforeend', html);
  }
}
