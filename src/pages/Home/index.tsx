import React, { useState, useEffect } from "react";
import { MdAddShoppingCart } from "react-icons/md";

import { ProductList } from "./styles";
import { api } from "../../services/api";
import { formatPrice } from "../../util/format";
import { useCart } from "../../hooks/useCart";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    // TODO
    if (!sumAmount[product.id]) {
      sumAmount[product.id] = 1;
    } else {
      sumAmount[product.id]++;
    }

    return sumAmount;
  }, {} as CartItemsAmount);

  useEffect(() => {
    async function loadProducts() {
      // TODO
      api.get("/products").then((response) => setProducts(response.data));
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    // TODO
    addProduct(id);
  }

  return (
    <ProductList>
      {products &&
        products.map((item, index) => (
          <li key={item.id}>
            <img src={item.image} alt={item.title} />
            <strong>{item.title}</strong>
            <span>{formatPrice(item.price)}</span>

            <button
              type="button"
              data-testid="add-product-button"
              onClick={() => handleAddProduct(item.id)}
            >
              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {cartItemsAmount[item.id] || 0}
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        ))}

      {/* <li>
        <img
          src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg"
          alt="Tênis de Caminhada Leve Confortável"
        />
        <strong>Tênis de Caminhada Leve Confortável</strong>
        <span>R$ 179,90</span>
        <button
          type="button"
          data-testid="add-product-button"
          // onClick={() => handleAddProduct(product.id)}
        >
          <div data-testid="cart-product-quantity">
            <MdAddShoppingCart size={16} color="#FFF" />
            {cartItemsAmount[product.id] || 0} 2
          </div>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li> */}
    </ProductList>
  );
};

export default Home;
