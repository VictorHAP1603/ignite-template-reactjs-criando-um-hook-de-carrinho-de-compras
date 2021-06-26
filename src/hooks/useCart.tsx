import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
  type: string;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({
    productId,
    amount,
    type,
  }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      // TODO
      const productSelected: Product = (
        await api.get(`/products/${productId}`).then((res) => res)
      ).data;

      const stockOfProductSelected: Stock = (
        await api.get(`/stock/${productId}`).then((r) => r)
      ).data;

      if (cart.find(({ id }) => id === productSelected.id)) {
        let amountAdded = cart.map((item) => {
          if (item.id === productSelected.id) {
            item.amount++;
          }
          return item;
        });

        const ammountProduct = amountAdded.filter(
          (item) => item.id === productSelected.id
        )[0].amount;

        if (stockOfProductSelected.amount >= ammountProduct) {
          localStorage.setItem(
            "@RocketShoes:cart",
            JSON.stringify(amountAdded)
          );
        } else {
          amountAdded.map((item) => {
            if (item.id === productSelected.id) {
              item.amount--;
            }
            return item;
          });

          localStorage.setItem(
            "@RocketShoes:cart",
            JSON.stringify(amountAdded)
          );

          throw new Error();
        }

        setCart(amountAdded);
      } else {
        const firstProduct = {
          ...productSelected,
          amount: 1,
        };

        localStorage.setItem(
          "@RocketShoes:cart",
          JSON.stringify([...cart, firstProduct])
        );
        setCart([...cart, firstProduct]);
      }
    } catch (error) {
      // TODO
      toast.error("Quantidade solicitada fora de estoque");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
      const cartFiltred = cart.filter((item) => item.id !== productId);

      localStorage.setItem("@RocketShoes:cart", JSON.stringify(cartFiltred));
      setCart(cartFiltred);
    } catch {
      // TODO
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
    type,
  }: UpdateProductAmount) => {
    try {
      // TODO
      const productSelected: Product = (
        await api.get(`/products/${productId}`).then((res) => res)
      ).data;

      const stockOfProductSelected: Stock = (
        await api.get(`/stock/${productId}`).then((r) => r)
      ).data;

      if (type === "increment") {
        if (amount < stockOfProductSelected.amount) {
          const amountAdded = cart.map((item) => {
            if (item.id === productSelected.id) {
              item.amount++;
            }
            return item;
          });

          localStorage.setItem(
            "@RocketShoes:cart",
            JSON.stringify(amountAdded)
          );
          setCart(amountAdded);
        } else {
          throw new Error();
        }
      } else {
        const amountAdded = cart.map((item) => {
          if (item.id === productSelected.id) {
            item.amount--;
          }
          return item;
        });

        localStorage.setItem("@RocketShoes:cart", JSON.stringify(amountAdded));
        setCart(amountAdded);
      }
    } catch (error) {
      // TODO
      toast.error("Quantidade solicitada fora de estoque");
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
