class Model {
    constructor () {
        this.dataProduct = [];
        this.basketData = [];
    }

    addProduct(product) {
        this.dataProduct.push(product);
    }

    addBasket(product) {
        this.basketData.push(product);
    }

    deleteProduct(code) {
        this.dataProduct = this.dataProduct.
            filter(prod => prod.code !== code);
    }

    deleteBasketProduct(code) {
        this.basketData = this.basketData.
            filter(prod => prod.code !== code);
    }

    getProduct() {
        return this.dataProduct;
    }
};

class View {
    constructor () {
        this.addBtn = document.getElementById('addBtn');
        this.basketBtn = document.getElementById('basketBtn');
        this.border = document.getElementById('product');
        this.cont = document.querySelector('.count');
        this.detal = document.getElementById('detalName');

        this.modalAddProduct();
        this.modalBasket();
        this.onPay = null;
        this.onDelete = null;
        this.onDeleteBasketProduct = null;
    }

    renderCard(products) {
        this.border.innerHTML = '';

        products.forEach(product => {
            const cardDiv = document.createElement('DIV');
            cardDiv.classList.add('card');
            cardDiv.insertAdjacentHTML('beforeend', `
                    <div class="info">
                        <img src="${product.photo}" class="photo">
                        <h3>${product.name}</h3>
                        <p>Артикул: ${product.code}</p>
                        <p><strong>${product.price}</strong> грн</p>
                    </div>

                    <div class="pay-delete">
                        <button type="button" class="payBtn">Pay</button>
                        <button type="button" class="deleteBtn">Delet</button>
                    </div>
                `);
                const deleteBtn = cardDiv.querySelector('.deleteBtn');
                const payBtn = cardDiv.querySelector('.payBtn');

                deleteBtn.addEventListener('click', (e) => {
                    if (e.target) this.onDelete(product.code);
                });

                payBtn.addEventListener('click', (e) => {
                    if (e.target) this.onPay(product.code);
                });

                this.border.appendChild(cardDiv);
        });
    }

    modalAddProduct() {
        this.modalForm = document.createElement('DIV');
            this.modalForm.classList.add('infoProd');

            this.modalForm.insertAdjacentHTML('beforeend', `
                    <form name="formInfo">
                        <div class="infoInput">
                            <label for="photo">Загрузите фото</label>
                            <input type="file" id="photo">
                        </div>

                        <div class="infoInput">
                            <label for="name">Название товара</label>
                            <input type="text" id="name">
                        </div>

                        <div class="infoInput">
                            <label for="code">Код товара</label>
                            <input type="text" id="code">
                        </div>

                        <div class="infoInput">
                            <label for="price">Стоимость товара</label>
                            <input type="text" id="price">
                        </div>

                        <button type="submit" id="addProd">Add<strong>+</strong></button>
                    </form>
                `);

            this.cont.addEventListener('click', (e) => {
                this.modalForm.classList.remove('active');
            });

        document.body.appendChild(this.modalForm);
    }

    modalBasket() {
        this.basket = document.createElement('DIV');
        this.basket.classList.add('modalBasket');
        this.basket.insertAdjacentHTML('beforeend', `
                <div class="contentBasket">
                    <div class="basketHead">
                        <h2>Корзина</h2>
                        <button type="button" id="closeBtn">Закрыть</button>
                    </div>
                    <hr>

                    <div class="basketList">
                        <table>
                            <thead>
                                <tr>
                                    <th>Фото</th>
                                    <th>Название</th>
                                    <th>Артикул</th>
                                    <th>Цена</th>
                                </tr>
                            </thead>
                            <tbody class="basketTableBody"></tbody>
                        </table>
                    </div>

                    <hr>

                    <div class="basketFooter">
                        <p>Всего к опалате <span id="totalPrice">0</span> грн</p>
                        <button type="button" id="ckeckBtn">Оформить</button>
                    </div>
                </div>
            `);

        this.basket.querySelector('#closeBtn').addEventListener('click', () => {
            this.basket.classList.remove('active');
        });

        document.body.appendChild(this.basket);
    }

    renderBasket(basketProducts) {
        const tableBody = this.basket.querySelector('.basketTableBody');
        const totalSpan = this.basket.querySelector('#totalPrice');

        tableBody.innerHTML = '';

        basketProducts.forEach(product => {
            const row = document.createElement('TR');

            row.insertAdjacentHTML('beforeend', `
                    <td>
                        <img src="${product.photo}">
                    </td>
                    <td class="basketName">${product.name}</td>
                    <td>${product.code}</td>
                    <td>
                        <strong>${product.price}</strong>
                    </td>
                    <td>
                        <button type="button" class="deletProd"></button>
                    </td>
                `);

                const deleteProdBtn = row.querySelector('.deletProd');

                deleteProdBtn.addEventListener('click', () => {
                    if (this.onDeleteBasketProduct) {
                        this.onDeleteBasketProduct(product.code);
                    }
                });

                tableBody.appendChild(row);
        });

        const total = basketProducts.reduce((sum, prod) => {
            const clearPrice = String(prod.price).replaceAll(' ', '');
            return sum + Number(clearPrice);
        },0);

        totalSpan.textContent = total.toLocaleString();

        this.basket.classList.add('active');
    }

    renderFiltr(products) {
        if (this.divFilter && this.showBtn) {
            this.divFilter.remove();
            this.showBtn.remove();
        }

        this.showBtn = document.createElement('BUTTON');
        this.showBtn.classList.add('showBtn');
        this.showBtn.setAttribute('type', 'button');
        this.showBtn.textContent = 'Show';

        this.divFilter = document.createElement('DIV');
        this.divFilter.classList.add('divFilter');

        const arrProdName = products.map(prod => prod.name.split(' ')[0]);
        const names = [];
        arrProdName.forEach(name => {
            if(!names.includes(name)) names.push(name);
        });

        names.forEach(name => {
            this.divFilter.insertAdjacentHTML('beforeend', `
                <div class="chekFilter">
                    <input type="checkbox" id="${name}" value="${name}">
                    <label for="${name}">${name}</label>
                </div>
            `);
        });
        this.detal.appendChild(this.divFilter);
        this.detal.appendChild(this.showBtn);
    }

    filterBorder(products) {
        const allBoxes = this.divFilter.querySelectorAll('input[type="checkbox"]');

        const checkedValue = Array.from(allBoxes)
            .filter(input => input.checked)
            .map(input => input.value);

            const allCards = this.border.querySelectorAll('.card');

            allCards.forEach(card => {
                const name = card.querySelector('h3').textContent;
                const word = name.split(' ')[0];

                if (checkedValue.length === 0 || checkedValue.includes(word)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
    }

    bindPay(handler) {
        this.onPay = handler;
    }

    bindAdd(handler) {
        this.addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.modalForm.classList.add('active');
        });

        const form = this.modalForm.querySelector('form');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let photo = '';
            const name = form.name.value;
            const code = form.code.value;
            const price = form.price.value;

            const formPhoto = form.photo;
            if (formPhoto.files.length > 0) {
                photo = URL.createObjectURL(formPhoto.files[0]);
            }

            const product = {
                photo,
                name,
                code,
                price,
            };

            handler(product);

            form.reset();

            this.modalForm.classList.remove('active');
        });
    }

    bindBasket(handler) {
        this.basketBtn.addEventListener('click', () => {
            handler();
        });
    }

    bindFilter(handler) {
        this.detal.addEventListener('toggle', (e) => {
            if (this.detal.open) handler();
        });
    }

    bindFilterBorder(handler) {
        this.detal.addEventListener('click', (e) => {
            if(e.target && e.target.classList.contains('showBtn')) {
                handler();
                console.log(true);
            }
        })
    }

    bindDelete(handler) {
        this.onDelete = handler;
    }

    bindDeleteBasket(handler) {
        this.onDeleteBasketProduct = handler;
    }
};

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindAdd(this.handlerAdd);
        this.view.bindPay(this.handlerPay);
        this.view.bindBasket(this.handlerBasket);
        this.view.bindFilter(this.handlerFilter);
        this.view.bindFilterBorder(this.handlerFilterBorder);
        this.view.bindDelete(this.handlerDelete);
        this.view.bindDeleteBasket(this.handlerDeleteBasket)
    }

    handlerAdd = (product) => {
        this.model.addProduct(product);
        this.view.renderCard(this.model.getProduct());
    }

    handlerBasket = () => {
        this.view.renderBasket(this.model.basketData);
    }

    handlerPay = (code) => {
        const product = this.model.dataProduct.find(p => p.code === code);

        if(product) this.model.addBasket(product);
        
        this.view.renderBasket(this.model.basketData);
    }

    handlerFilter = () => {
        this.view.renderFiltr(this.model.dataProduct);
    }

    handlerFilterBorder = () => {
        this.view.filterBorder(this.model.getProduct());
    }

    handlerDelete = (code) => {
        this.model.deleteProduct(code);
        this.view.renderCard(this.model.dataProduct);
    }

    handlerDeleteBasket = (code) => {
        this.model.deleteBasketProduct(code);
        this.view.renderBasket(this.model.basketData);
    }
};

new Controller(new Model, new View);