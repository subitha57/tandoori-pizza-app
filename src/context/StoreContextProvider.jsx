
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cart, setCart] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [crusts, setCrusts] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [aCheeses, setACheeses] = useState([]);
  const [pCheeses, setPCheeses] = useState([]);
  const [meats, setMeats] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [feistyProducts, setFeistyProducts] = useState([]);
  const [beverages, setBeverages] = useState([]);
  const [appetizers, setAppetizers] = useState([]);
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [sizes, setSizes] = useState([]);
  const [prices, setPrices] = useState([]);
  const [Classics, setClassics] = useState([]);
  const [user, setUser] = useState(null);
  const [cartRestaurant, setCartRestaurant] = useState(null);
  const [extraPrice, setExtraPrice] = useState(0); // Extra price for customizations
  const [selectedOrderType, setSelectedOrderType] = useState(null);
  const [defaultIngredientIds, setDefaultIngredientIds] = useState([]);
  const [fixedIngredientIds, setFixedIngredientIds] = useState([]);
  const [selectedPizza, setSelectedPizza] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('Stored user loaded:', parsedUser); // Debug log
      } catch (error) {
        console.error('Failed to parse stored user:', error); // Handle parsing error
      }
    }
    fetchProducts();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Save user data to local storage
    console.log('User logged in:', userData); // Debug log
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove user data from local storage
    localStorage.removeItem('authToken');
    console.log('User logged out'); // Debug log
  };

  const updateExtraPrice = (price) => {
    setExtraPrice(price);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://test.tandooripizza.com/api/online/store/getData?id=1');
      const allProducts = response.data.Products;
      const sizes = response.data.Sizes;
      const prices = response.data.Prices;

      setDefaultIngredientIds(response.data.DefaultIngredientIds || []);
      setFixedIngredientIds(response.data.FixedIngredientIds || []);

      const updatedProducts = allProducts.map(product => {
        if (product.CategoryType === 2 && product.ExtraPrice === undefined) {
          return {
            ...product,
            ExtraPrice: response.data.ExtraPrices.find(extra => extra.ProductId === product.ProductId)?.Price || 0,
          };
        }
        return product;
      });
  
      setProducts(updatedProducts.filter(product => 
        product.CategoryName !== 'Crust' && 
        product.CategoryName !== 'Sauce' && 
        product.CategoryName !== 'ACheese' && 
        product.CategoryName !== 'PCheese' && 
        product.CategoryName !== 'Pizza-Toppings'));

      setCrusts(allProducts.filter(product => product.CategoryName === 'Crust'));
      setSauces(allProducts.filter(product => product.CategoryName === 'Sauces'));
      setACheeses(allProducts.filter(product => product.CategoryName === 'ACheese'));
      setPCheeses(allProducts.filter(product => product.CategoryName === 'PCheese'));
      setMeats(allProducts.filter(product => product.CategoryName === 'Pizza-Toppings' && product.IsNonVeg));
      setVegetables(allProducts.filter(product => product.CategoryName === 'Pizza-Toppings' && !product.IsNonVeg));
      setFeistyProducts(allProducts.filter(product => product.CategoryName === 'The Feisty One'));
      setClassics(allProducts.filter(product => product.CategoryName === 'The Classics'));
      setSizes(sizes);
      setPrices(prices);

      const beverages = allProducts.filter(product => ['Water', 'Soft Drinks', 'Wine', 'Beer', 'Juice'].includes(product.CategoryName));
      setBeverages(beverages);

      const appetizers = allProducts.filter(product => ['Garlic Sticks with Cheese', 'Boneless', 'Garlic Bread with Cheese', 'Mozzarella Sticks', 'Jalapeno Poppers', 'Traditional Wings', 'Wing Flavor'].includes(product.CategoryName));
      setAppetizers(appetizers);

      const extras = allProducts.filter(product => ['Green Beans (greenbeans)', 'Wing Flavor', 'Cookies', 'Sides (extraside)', 'Sides'].includes(product.CategoryName));
      extras.forEach(extra => {
        extra.Cost = 0.50; 
      });
      setExtras(extras);

      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  const updateQuantity = (itemId, newQuantity) => {
    setCart(cart.map((item, index) => 
        index === itemId ? { ...item, quantity: newQuantity } : item
    ));
  }
  
  const addToCart = (item, crust, sauce, aCheese, pCheese, toppings) => {
    const customizedItem = {
      ...item,
      crust,
      sauce,
      aCheese,
      pCheese,
      toppings,
      price: item.price + (crust?.Cost || 0),
    };
    setCart((prevCart) => [...prevCart, customizedItem]);
  };

  const removeFromCart = (index) => {
    console.log('Removing item with index:', index);
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((_, i) => i !== index);
      console.log('Updated cart:', updatedCart);
      return updatedCart;
    });
  };
  

  // Calculate total cart amount including tax
const getTotalCartAmount = () => {
  let totalAmount = 0;
  for (const item of cart) {
    totalAmount += item.price * item.quantity;
  }
  const tax = totalAmount * 0.02; // 2% tax
  return totalAmount + tax;
};

// Calculate total price of cart items including tax
const getTotalPriceOfCartItems = () => {
  let totalPrice = 0;
  for (const item of cart) {
    totalPrice += item.price * item.quantity;
  }
  const tax = totalPrice * 0.02; // 2% tax
  return totalPrice + tax;
};

  const contextValue = {
    products,
    cart,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalPriceOfCartItems,
    loading,
    error,
    setCategory,
    crusts,
    sauces,
    aCheeses,
    pCheeses,
    meats,
    vegetables,
    feistyProducts,
    beverages,
    appetizers,
    extras,
    sizes,
    prices,
    user,
    setUser: login,
    cartRestaurant,
    setCartRestaurant,
    login,
    logout, 
  extraPrice,
  updateExtraPrice  ,
  selectedOrderType,
    setSelectedOrderType,
    defaultIngredientIds,
    fixedIngredientIds,
    updateQuantity,
    selectedPizza,
     setSelectedPizza 
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;