const express = require('express');
const createCrudController = require('../controllers/crudController');

const router = express.Router();

// Table configurations
const tables = {
  services: {
    table: 'Услуга',
    id: 'idУслуги',
    columns: ['Описание', 'Стоимость', 'Едицина_измерения'],
  },
  rooms: {
    table: 'Помещение',
    id: 'idПомещения',
    columns: ['Наименование', 'Тип_помещения', 'Площадь', 'Статус'],
  },
  employees: {
    table: 'Сотрудники',
    id: 'idСотрудника',
    columns: ['ФИО', 'Должность', 'Контактные_данные'],
  },
  catalog: {
    table: 'Каталог',
    id: 'idКаталога',
    columns: ['Жанр', 'Вид_лицензии', 'Продакшн', 'Цена', 'Статус', 'Дата_создания'],
  },
  clients: {
    table: 'Клиенты',
    id: 'idКлиента',
    columns: ['ФИО', 'Контактные_данные', 'Данные_для_договора'],
  },
  equipment: {
    table: 'Оборудование',
    id: 'idОборудования',
    columns: [
      'Сотрудники_idСотрудника',
      'Помещение_idПомещения',
      'Наименование',
      'Тип',
      'Модель',
      'Серийный_номер',
    ],
  },
  deals: {
    table: 'Сделка',
    id: 'idСделки',
    columns: [
      'Сотрудники_idСотрудника',
      'Каталог_idКаталога',
      'Клиенты_idКлиента',
      'Дата',
      'Сумма_сделки',
      'Номер_договора',
    ],
  },
  provisions: {
    table: 'Оказание_услуги',
    id: 'idОказание_услуги',
    columns: [
      'Помещение_idПомещения',
      'Услуга_idУслуги',
      'Сотрудники_idСотрудника',
      'Сделка_idСделки',
      'Количество',
      'Дата_время_оказания',
    ],
  },
};

// Register CRUD routes for each table
Object.entries(tables).forEach(([key, config]) => {
  const controller = createCrudController(config.table, config.id, config.columns);
  const r = express.Router();

  r.get('/', controller.getAll);
  r.get('/:id', controller.getById);
  r.post('/', controller.create);
  r.put('/:id', controller.update);
  r.delete('/:id', controller.remove);

  router.use(`/${key}`, r);
});

module.exports = router;
