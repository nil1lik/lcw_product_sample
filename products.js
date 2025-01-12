(() => {
    const init = async () => {
        const products = await getProducts();
        buildHTML(products);
        buildCSS();
        setCarouselEvents();
        setFavoriteEvents();
        updateFavorites();
    };

    const getProducts = async () => {
        const localData = localStorage.getItem('products');
        if (localData) {
            return JSON.parse(localData);
        }
        try {
            const response = await fetch(
                'https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json'
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            localStorage.setItem('products', JSON.stringify(data));
            return data;
        } catch (error) {
            console.error('Veri çekilirken bir hata oluştu:', error);
            return [];
        }
    };

    const buildHTML = (products) => {
        const html = `
            <div class="carousel">
                <h2 class="carousel-title">Beğenebileceğiniz Ürünler</h2>
                <div class="carousel-inner">
                    ${products.map(product => `
                        <div class="product-card" data-url="${product.url}" data-id="${product.id}">
                            <img src="${product.img}" 
                                 alt="${product.name}" 
                                 class="product-image">
                            <h3 class="product-name">${product.name}</h3>
                            <p class="product-price">${product.price} TL</p>
                            <button class="favorite-button">&#x2764;&#xfe0e;</button>
                        </div>
                    `).join('')}
                </div>
                <button class="carousel-prev">&#x2190;</button>
                <button class="carousel-next">&#x2192;</button> 
            </div>
        `;
        const targetElement = document.querySelector('.product-detail') || document.body;
        targetElement.insertAdjacentHTML('beforeend', html);
    
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const url = card.getAttribute('data-url');
                window.location.href = url;
            });
        });
    };    

    const buildCSS = () => {
        const css = `
            .carousel {
                margin: 20px auto;
                padding: 10px;
                border: 1px solid #ddd;
                background-color: #fff;
                text-align: center;
                max-width: 90%;
                overflow: hidden;
            }

            .carousel-inner {
                display: flex;
                gap: 10px;
                overflow-x: auto;
                scroll-behavior: smooth;
            }

            .carousel-title {
                text-align: left;
                padding-bottom: 20px;
                padding-left: 10px;
            }

            .product-card {
                flex: 0 0 calc(100% / 6.5);
                background-color: #f9f9f9;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 350px;
                position: relative;
                box-sizing: border-box;
            }

            .product-image {
                max-width: 100%;
                height: auto;
                margin-bottom: 10px;
            }

            .product-name {
                font-size: 16px;
                font-weight: bold;
                margin: 10px 0;
                flex-grow: 1;
            }

            .product-price {
                font-size: 16px;
                color: blue;
                margin-top: auto;
                font-weight: bold;
            }

            .favorite-button {
                font-size: 20px;
                cursor: pointer;
                color: #888;
                background: none;
                border: none;
                transition: color 0.3s;
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 10;
            }

            .favorite-button.favorited {
                color: blue;
            }

            .carousel-prev, .carousel-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background-color: rgba(0, 0, 0, 0.5);
                border: none;
                color: white;
                font-size: 20px;
                padding: 10px;
                cursor: pointer;
            }

            .carousel-prev {
                left: 0;
            }

            .carousel-next {
                right: 0;
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    const setCarouselEvents = () => {
        const carouselInner = document.querySelector('.carousel-inner');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');

        prevButton.addEventListener('click', () => {
            carouselInner.scrollLeft -= carouselInner.offsetWidth / 6.5;
        });

        nextButton.addEventListener('click', () => {
            carouselInner.scrollLeft += carouselInner.offsetWidth / 6.5;
        });
    };

    const setFavoriteEvents = () => {
        const favoriteButtons = document.querySelectorAll('.favorite-button');

        favoriteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productCard = button.closest('.product-card');
                const productId = productCard.getAttribute('data-id');
                toggleFavorite(productId, button);
            });
        });
    };

    const toggleFavorite = (productId, button) => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFavorite = favorites.includes(productId);

        if (isFavorite) {
            favorites = favorites.filter(id => id !== productId);
            button.classList.remove('favorited');
        } else {
            favorites.push(productId);
            button.classList.add('favorited');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    };

    const updateFavorites = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        document.querySelectorAll('.product-card').forEach(card => {
            const productId = card.getAttribute('data-id');
            const favoriteButton = card.querySelector('.favorite-button');

            if (favorites.includes(productId)) {
                favoriteButton.classList.add('favorited');
            } else {
                favoriteButton.classList.remove('favorited');
            }
        });
    };

    init();
})();