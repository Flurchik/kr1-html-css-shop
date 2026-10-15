// Получаем элементы модального окна
const orderDialog = document.getElementById('order-dialog');
const dialogProductName = document.getElementById('dialog-product-name');
const selectedProductInput = document.getElementById('selected-product');

// Получаем кнопки вызова модального окна (только кнопки «Заказать», не ссылки)
const orderButtons = document.querySelectorAll('button[data-product], button.product-card__button');

// Получаем кнопки закрытия (кнопка внизу и крестик в правом верхнем углу)
const closeDialogButtons = document.querySelectorAll('#close-order-dialog, .order-dialog__close');

// Инициализация кнопок открытия диалога
if (orderButtons.length > 0) {
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product;

      // Записываем выбранный товар в скрытое поле
      if (selectedProductInput && productName) {
        selectedProductInput.value = productName;
      }

      // Обновляем визуальный бейдж товара в шапке модалки
      if (dialogProductName && productName) {
        dialogProductName.textContent = productName;
      }

      // Открываем модальное окно
      if (orderDialog && typeof orderDialog.showModal === 'function') {
        orderDialog.showModal();
      }
    });
  });
}

// Закрытие модального окна по кнопкам
if (closeDialogButtons.length > 0 && orderDialog) {
  closeDialogButtons.forEach((button) => {
    button.addEventListener('click', () => {
      orderDialog.close();
    });
  });
}

// Закрытие модального окна по клику на оверлей (backdrop)
if (orderDialog) {
  orderDialog.addEventListener('click', (event) => {
    const rect = orderDialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      orderDialog.close();
    }
  });
}

// Обработка форм и клиентская валидация
const forms = document.querySelectorAll('.order-form');
const successMessage = document.getElementById('success-message');

forms.forEach((form) => {
  const formElements = Array.from(form.elements);

  // Снятие подсветки ошибки сразу при вводе правильных данных
  formElements.forEach((element) => {
    if (element.willValidate) {
      element.addEventListener('input', () => {
        if (element.checkValidity()) {
          element.removeAttribute('aria-invalid');
        }
      });
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Сбрасываем предыдущие ошибки
    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    // Валидация полей
    if (!form.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });
      form.reportValidity();
      return;
    }

    // Успешная отправка
    form.reset();

    // Закрываем модалку, если отправка шла из неё
    if (orderDialog && orderDialog.open) {
      orderDialog.close();
    }

    // Показываем уведомление об успешной отправке
    if (successMessage) {
      successMessage.hidden = false;
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});

// Динамическое обновление стоимости на отдельной странице заказа (order.html)
const orderProductSelect = document.getElementById('order-product-select');
if (orderProductSelect) {
  const gameData = {
    minecraft: { name: 'Minecraft Dungeons: Ultimate', price: '1 990 руб.' },
    terraria: { name: 'Terraria (Лицензия)', price: '349 руб.' },
    gta5: { name: 'Grand Theft Auto V: Premium', price: '1 490 руб.' },
    witcher3: { name: 'Ведьмак 3: Дикая Охота', price: '890 руб.' },
    cyberpunk: { name: 'Cyberpunk 2077 (Ultimate)', price: '2 190 руб.' },
    hollowknight: { name: 'Hollow Knight (Лицензия)', price: '550 руб.' }
  };

  orderProductSelect.addEventListener('change', () => {
    const val = orderProductSelect.value;
    const summaryRows = document.querySelectorAll('.order-summary__row');
    if (val && gameData[val] && summaryRows.length >= 5) {
      // Название товара
      summaryRows[0].querySelector('span:last-child').textContent = gameData[val].name;
      // Стоимость
      summaryRows[1].querySelector('span:last-child').textContent = gameData[val].price;
      // Итого
      summaryRows[4].querySelector('span:last-child').textContent = gameData[val].price;
    }
  });
}
