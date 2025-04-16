import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { IProduct, TContactsInfo, TOrderInfo } from './types';
import { ProductsData } from './components/ProductsData';
import { BasketData } from './components/BasketData';
import { OrderData } from './components/OrderData';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new AppApi(API_URL, CDN_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

// Все шаблоны
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success')

// Модели данных приложения
const productsData = new ProductsData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Получаем товары с сервера
api.getProducts()
  .then((res) => {
    productsData.cards = res;
  })
  .catch((err) => {
    console.error(err);
  });

// Изменились элементы каталога
events.on('cards:changed', () => {
  page.catalog = productsData.cards.map(item => {
    const card = new Card(cloneTemplate(cardTemplate), {
      onClick: () => events.emit('card:select', item)
    })
    return card.render(item)});
});

// Получить данные выбранной карточки
events.on('card:select', (item: IProduct) => {
  productsData.setPreview(item);
});

// Открыть модальное окно выбранного товара
events.on('card:selected', (item: IProduct) => {
  const cardPreview = new Card(cloneTemplate(previewTemplate), {
    onClick: () => {
			if (basketData.isInBasket(item)) {
				basketData.deleteCard(item.id);
				cardPreview.button = 'Купить';
			} else {
				basketData.addCard(item);
				cardPreview.button = 'Убрать';
			}
    }
  });
  cardPreview.button = basketData.isInBasket(item) ? 'Убрать' : 'Купить';
  modal.render({content: cardPreview.render(item)});
});

// Добавление товара в корзину
events.on('card:add', (item: IProduct) => {
  item.isInBasket = true;
  basketData.addCard(item);
  page.counter = basketData.getAmount();
})

// Удаление товара из корзины
events.on('card:delete', (item: IProduct) => {
	basketData.deleteCard(item.id);
}); 

// Изменилось содержимое корзины
events.on('basket:changed', () => { 
	page.counter = basketData.getAmount();
  let i = 1;
	basket.items = basketData.cards.map((item) => {
		const basketCard = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				basketData.deleteCard(item.id);
			}
		});
		return basketCard.render({
			title: item.title,
			price: item.price,
			index: i++,
		});	
	})
	basket.total = basketData.getTotal();
  basket.selected = basketData.getTotal();
});

// Открыть корзину
events.on('basket:open', () => {
  modal.render({
    content: basket.render()
  });
});

// Открыть форму заказа
events.on('order:open', () => {
  modal.render({
    content: order.render({
        payment: '',
        address: '',
        valid: false,
        errors: []
    })
  });
});

// Открыть форму контактной информации
events.on('order:submit', () => {
  modal.render({
    content: contacts.render({
        email: '',
        phone: '',
        valid: false,
        errors: []
      }
    ),
  });
})

// Изменилось одно из полей формы заказа
events.on(/^order\..*:change/, (data: { field: keyof TOrderInfo, value: string }) => {
  orderData.setOrderInfo(data.field, data.value);
});

// Изменилось одно из полей формы контактных данных
events.on(/^contacts\..*:change/, (data: { field: keyof TContactsInfo, value: string }) => {
  orderData.setContacts(data.field, data.value);
});

// Изменилось состояние валидации формы заказа
events.on('order:validation', (errors: Partial<TOrderInfo>) => {
  const { payment, address } = errors;
  order.valid = !payment && !address;
  order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

// Изменилось состояние валидации формы контактных данных
events.on('contacts:validation', (errors: Partial<TContactsInfo>) => {
  const { email, phone  } = errors;
  contacts.valid = !email && !phone;
  contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Отправка заказа
events.on('contacts:submit', () => {
  orderData.total = basketData.getTotal();
  orderData.setItems(basketData.cards);
  api.postOrder(orderData.getOrder())
    .then((res) => {
      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
            modal.close();
        }
      });

      modal.render({
        content: success.render({
          total: res.total,
        })
      });
    })
    .then(() => {
      basketData.clear();
      orderData.clear();
      order.toggleOnline(false);
      order.toggleCash(false);
    })
    .catch(err => {
      console.error(err);
    });
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => { 
  page.locked = false;
});