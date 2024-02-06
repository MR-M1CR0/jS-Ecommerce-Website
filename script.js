document.addEventListener('DOMContentLoaded', function () {
  let slideIndex = 0;
  let slidesContainer = document.querySelector('.slides');
  let slides = slidesContainer.querySelectorAll('img');

  let firstSlideClone = slides[0].cloneNode(true);
  slidesContainer.appendChild(firstSlideClone);

  let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || []; // Retrieve cart items from session storage
  let cartBadge; // Declare cartBadge variable

  function updateCartBadge() {
    cartBadge.textContent = cartItems.length > 0 ? cartItems.length : ''; // Update cart badge count
  }

  function plusSlides(n) {
    slideIndex += n;
    if (slideIndex > slides.length) {
      slidesContainer.style.transition = 'none';
      slidesContainer.style.transform = `translateX(0%)`;
      slideIndex = 1;
    } else {
      slidesContainer.style.transition = 'transform 0.5s ease-in-out';
    }
    if (slideIndex < 0) {
      slideIndex = slides.length - 1;
    }
    slidesContainer.style.transform = `translateX(-${slideIndex * 100}%)`;
  }

  document.querySelector('.slider-prev').addEventListener('click', function () {
    plusSlides(-1);
  });

  document.querySelector('.slider-next').addEventListener('click', function () {
    plusSlides(1);
  });

  setInterval(function () {
    plusSlides(1);
  }, 5000);

  // Fetch products data
  fetch('https://json-server-ahmed-mahfouz.vercel.app/products')
    .then((response) => response.json())
    .then((data) => {
      initializeProducts(data);
    })
    .catch((error) => console.error('Error:', error));

  const initializeProducts = (data) => {
    let productsContainer = document.querySelector('#products .row');
    let categoryButtons = document.querySelectorAll(
      '.categories-container button'
    );

    // Function to render products
    const renderProducts = (products) => {
      productsContainer.innerHTML = ''; // Clear previous products
      if (products.length === 0) {
        productsContainer.innerHTML =
          '<p>No products available for this category.</p>';
      } else {
        products.forEach((product) => {
          let col = document.createElement('div');
          col.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';

          let card = document.createElement('div');
          card.className = 'card shadow-sm h-100 rounded p-3';

          let img = document.createElement('img');
          img.className = 'card-img-top';
          img.src = product.img; // Update image source
          img.alt = product.name;
          img.style.height = '200px';
          img.style.objectFit = 'fit';

          let cardBody = document.createElement('div');
          cardBody.className =
            'card-body d-flex flex-column justify-content-between';

          let cardTitle = document.createElement('h5');
          cardTitle.className = 'card-title mb-2';
          cardTitle.textContent = product.name; // Update product name

          let cardText = document.createElement('p');
          cardText.className = 'card-text';
          cardText.textContent = product.description;
          cardText.style.overflow = 'hidden';
          cardText.style.textOverflow = 'ellipsis';
          cardText.style.display = '-webkit-box';
          cardText.style.webkitBoxOrient = 'vertical';
          cardText.style.webkitLineClamp = '2';

          let price = document.createElement('p');
          price.className = 'mt-auto font-weight-bold text-danger';
          price.textContent = '$' + product.price.toFixed(2);

          let addToCartBtn = document.createElement('button');
          addToCartBtn.className = 'btn btn-sm btn-danger add-to-cart p-0';
          addToCartBtn.innerHTML =
            '<i class="bi bi-cart-plus" style="font-size: 1.5rem;"></i>';
          addToCartBtn.dataset.id = product.id; // Set product ID as a data attribute

          cardBody.appendChild(cardTitle);
          cardBody.appendChild(cardText);
          cardBody.appendChild(price);
          cardBody.appendChild(addToCartBtn);
          card.appendChild(img);
          card.appendChild(cardBody);
          col.appendChild(card);
          productsContainer.appendChild(col);
        });
      }

      // Add event listeners to "Add to Cart" buttons
      let addToCartButtons = document.querySelectorAll('.add-to-cart');
      addToCartButtons.forEach((button) => {
        button.addEventListener('click', () => {
          let productId = button.dataset.id;
          let productToAdd = data.find(
            (product) => product.id === parseInt(productId)
          );
          if (productToAdd) {
            cartItems.push(productToAdd); // Add product to cart
            updateCartBadge(); // Update cart badge
            renderCart(); // Render the updated cart
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems)); // Save cart items to session storage
          });
        });
      }
    };

    // Render all products initially
    renderProducts(data);

    // Add click event listeners to category buttons
    categoryButtons.forEach((button) => {
      button.addEventListener('click', () => {
        let category = button.textContent.trim().toLowerCase();
        let filteredProducts;

        // Dynamically filter products based on the category button clicked
        filteredProducts = data.filter(
          (product) => product.category.toLowerCase() === category
        );

        renderProducts(filteredProducts); // Render products based on filtered data
      });
    });

    // Function to scroll to top smoothly
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    // Show or hide back to top button based on scroll position
    const toggleBackToTopButton = () => {
      const backToTopBtn = document.getElementById('back-to-top-btn');
      if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
      } else {
        backToTopBtn.style.display = 'none';
      }
    };

    // Add event listener for scrolling
    window.addEventListener('scroll', toggleBackToTopButton);

    // Add event listener for back to top button
    document
      .getElementById('back-to-top-btn')
      .addEventListener('click', scrollToTop);

    const cartIcon = document.getElementById('cart');
    const cartCloseIcon = document.getElementById('close-cart');
    const cart = document.querySelector('.cart');

    // Function to toggle cart visibility
    const toggleCart = () => {
      cart.classList.toggle('active');
    };

    // Event listener for cart icon click
    cartIcon.addEventListener('click', toggleCart);

    // Event listener for cart close icon click
    cartCloseIcon.addEventListener('click', toggleCart);

    // Function to render the cart
    const renderCart = () => {
      let cartContent = document.querySelector('.cart-items');
      let totalPrice = document.querySelector('.total-price');

      // Clear previous cart items
      cartContent.innerHTML = '';

      // Render each cart item
      cartItems.forEach((item) => {
        let cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        let image = document.createElement('img');
        image.src = item.image; // Set image source
        image.alt = item.name;
        image.classList.add('cart-item-img');

        let title = document.createElement('h4');
        title.textContent = item.name;
        title.classList.add('cart-item-title', 'cart-product-title');

      let price = document.createElement('p');
      price.textContent = '$' + item.price.toFixed(2);
      price.classList.add('cart-item-price');

      // Create remove button
      let removeButton = document.createElement('i');
      removeButton.classList.add('bi', 'bi-trash-fill', 'cart-remove');
      removeButton.setAttribute('data-id', item.id);
      removeButton.addEventListener('click', () => {
        removeCartItem(item.id);
        renderCart();
        updateCartBadge();
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems)); // Save cart items to session storage after removal
      });

      cartItem.appendChild(image);
      cartItem.appendChild(title);
      cartItem.appendChild(price);
      cartItem.appendChild(removeButton); // Append remove button

        cartContent.appendChild(cartItem);
      });

    // Calculate and render total price
    let total = cartItems.reduce((acc, item) => acc + item.price, 0);
    totalPrice.textContent = '$' + total.toFixed(2);
  };

  // Function to remove item from cart
  const removeCartItem = (itemId) => {
    cartItems = cartItems.filter((item) => item.id !== itemId);
  };

    // Initialize cart badge
    cartBadge = document.querySelector('#cart .badge');
    // Update cart badge count initially
    updateCartBadge();

  // Render cart initially
  renderCart();
});
