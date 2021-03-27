import { createContext, useReducer } from "react";

export const CartContext = createContext();

const initialState = {
    carts: [],
    restaurant: null,
    transaction: []
};

const reducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case "ADD_CART":
            const findProductById = state.carts.find(
                (cart) => cart.id === payload.id
            );

            if (findProductById) {
                const updatedCarts = state.carts.map((cart) =>
                    cart.id === payload.id
                        ? {
                            ...cart,
                            qty: cart.qty + 1,
                        }
                        : cart
                );
                return {
                    ...state,
                    carts: updatedCarts,
                };
            }

            return {
                ...state,
                carts: [
                    ...state.carts, {
                        ...payload,
                        qty: 1
                    },
                ],
            };
        case "DECREMENT_CART":
            const findProductById2 = state.carts.find(
                (cart) => cart.id === payload.id
            );

            if (findProductById2) {
                const updatedCarts = state.carts.map((cart) =>
                    cart.id === payload.id
                        ? {
                            ...cart,
                            qty: cart.qty - 1,
                        }
                        : cart
                );
                return {
                    ...state,
                    carts: updatedCarts,
                };
            }
        case "DELETE_CART":
            const filteredCarts = state.carts.filter(
                (cart) => cart.id !== payload.id
            );

            return {
                ...state,
                carts: filteredCarts,
            };
        case "ADD_RESTAURANT":
            return {
                ...state,
                carts: [],
                restaurant: payload,
            };
        case "ADD_ORDER":
            return {
                ...state,
                carts: [],
                restaurant: null,
                transaction: [
                    ...state.transaction, {
                        ...payload,
                    },
                ],
            };
        default:
            throw new Error();
    }
};

export const CartContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <CartContext.Provider value={[state, dispatch]}>
            {children}
        </CartContext.Provider>
    );
};
