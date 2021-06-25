import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  product: Product;
  type: string;
}

interface RemoveProduct {
  productId: number;
  type: string;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: ({ productId, type }: RemoveProduct) => void;
  updateProductAmount: ({ product, type }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [productsJson, setProductsJson] = useState<Product[]>();

  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  useEffect(() => {
    api.get("/products").then((response) => setProductsJson(response.data));
  }, []);

  const addProduct = async (productId: number) => {
    try {
      // TODO
      if (productsJson !== undefined) {
        const productSelected = productsJson.filter(
          ({ id }) => id === productId
        )[0];

        localStorage.setItem(
          "@RocketShoes:cart",
          JSON.stringify([...cart, productSelected])
        );

        setCart([...cart, productSelected]);
      }
    } catch {
      // TODO
    }
  };

  const removeProduct = ({ productId, type }: RemoveProduct) => {
    try {
      // TODO
      if (type === "one") {
        const removed = cart.findIndex(({ id }) => id === productId);
        const cartUpdate = cart.filter((item, index) => index !== removed);

        localStorage.setItem("@RocketShoes:cart", JSON.stringify(cartUpdate));

        setCart(cartUpdate);
      } else {
      }
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    product,
    type,
  }: UpdateProductAmount) => {
    try {
      // TODO
      if (type === "increment") {
        addProduct(product.id);
      } else {
        removeProduct({ productId: product.id, type: "one" });
      }
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
