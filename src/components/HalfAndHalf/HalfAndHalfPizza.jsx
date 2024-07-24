import React, { useState, useEffect, useContext } from 'react';
import './HalfAndHalfPizza.css'; // Import CSS file for CustomizePizza styling
import defaultImage from '../../assets/Plain.png'; // Import the default image
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContextProvider'; // Adjust the path as needed
import { FormControl, InputLabel, MenuItem, Select, TextField, Grid, Box, FormControlLabel, Checkbox, Button } from '@mui/material';

const HalfAndHalfPizza = ({ handleCloseHalfAndHalfPizza }) => {
  console.log("half", handleCloseHalfAndHalfPizza);

  // State for the left half of the pizza customization
  const [leftSize, setLeftSize] = useState('Large');
  const [leftQuantity, setLeftQuantity] = useState(1);
  const [leftPrice, setLeftPrice] = useState(0);
  const [leftCrust, setLeftCrust] = useState('');
  const [leftCheese, setLeftCheese] = useState('');
  const [leftCheeses, setLeftCheeses] = useState('');
  const [leftSauce, setLeftSauce] = useState('');
  const [leftSauces, setLeftSauces] = useState('');
  const [leftSelectedPizza, setLeftSelectedPizza] = useState(null);
  const [leftSelectedIngredients, setLeftSelectedIngredients] = useState([]);

  // State for the right half of the pizza customization
  const [rightSize, setRightSize] = useState('Large');
  const [rightQuantity, setRightQuantity] = useState(1);
  const [rightPrice, setRightPrice] = useState(0);
  const [rightCrust, setRightCrust] = useState('');
  const [rightCheese, setRightCheese] = useState('');
  const [rightCheeses, setRightCheeses] = useState('');
  const [rightSauce, setRightSauce] = useState('');
  const [rightSauces, setRightSauces] = useState('');
  const [rightSelectedPizza, setRightSelectedPizza] = useState(null);
  const [rightSelectedIngredients, setRightSelectedIngredients] = useState([]);
  const [ingredientQuantities, setIngredientQuantities] = useState({});

  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(0);

  const navigate = useNavigate();

  const FIXED_INGREDIENT_COST = 2.0;

  const {
    products,
    crusts,
    sauces,
    aCheeses,
    pCheeses,
    meats,
    vegetables,
    addToCart,
    user,
    cartRestaurant,
    setUser
  } = useContext(StoreContext);

  useEffect(() => {
    let selectedPizza, selectedSize;
    let leftCrust, leftCheese, leftSauce, leftIngredients = [];
    let rightCrust, rightCheese, rightSauce, rightIngredients = [];

    // Prioritize the left side for the base pizza price
    if (leftSelectedPizza) {
      selectedPizza = leftSelectedPizza;
      selectedSize = leftSize;
      leftCrust = leftCrust;
      leftCheese = leftCheese;
      leftSauce = leftSauce;
      leftIngredients = leftSelectedIngredients;
    } else if (rightSelectedPizza) {
      selectedPizza = rightSelectedPizza;
      selectedSize = rightSize;
      rightCrust = rightCrust;
      rightCheese = rightCheese;
      rightSauce = rightSauce;
      rightIngredients = rightSelectedIngredients;
    } else {
      setPrice(0); // No pizza selected, set price to 0
      return;
    }

    let basePrice = 0;
    switch (selectedSize) {
      case 'Large':
        basePrice = selectedPizza.LargePrice;
        break;
      case 'Extra Large':
        basePrice = selectedPizza.ExtraLargePrice;
        break;
      default:
        basePrice = 0;
    }

    let additionalCost = 0;

    // Add fixed cost for selected crust, cheese, sauce from the left side
    if (leftCrust) additionalCost += 2;
    if (leftCheese) additionalCost += 2;
    if (leftSauce) additionalCost += 2;

    // Add fixed cost for selected crust, cheese, sauce from the right side
    if (rightCrust) additionalCost += 2;
    if (rightCheese) additionalCost += 2;
    if (rightSauce) additionalCost += 2;

    // Add fixed cost for additional ingredients from both sides
    additionalCost += leftIngredients.length * 2;
    additionalCost += rightIngredients.length * 2;

    const calculatedPrice = basePrice + additionalCost;

    setPrice(calculatedPrice);
  }, [
    leftSelectedPizza,
    rightSelectedPizza,
    leftSize,
    rightSize,
    leftCrust,
    leftCheese,
    leftSauce,
    leftSelectedIngredients,
    rightCrust,
    rightCheese,
    rightSauce,
    rightSelectedIngredients,
    // Removed FIXED_INGREDIENT_COST from the dependency array as we directly use 2
  ]);

  const handleAddToCart = () => {
    const mapIngredientIdsToNames = (ingredientIds) => {
      return ingredientIds.map(id => {
        const ingredient = [...meats, ...vegetables, ...aCheeses, ...pCheeses].find(item => item.Id === id);
        return ingredient ? ingredient.Name : '';
      });
    };

    const leftCustomizedPizza = {
      name: leftSelectedPizza ? leftSelectedPizza.Name : 'Custom Pizza',
      size: leftSize,
      crust: leftCrust,
      cheese: leftCheese,
      sauce: leftSauce,
      ingredients: mapIngredientIdsToNames(leftSelectedIngredients),
      price: price, // Use the state price for the left half
      image: leftSelectedPizza && leftSelectedPizza.Image ? leftSelectedPizza.Image : defaultImage,
    };

    const rightCustomizedPizza = {
      name: rightSelectedPizza ? rightSelectedPizza.Name : 'Custom Pizza',
      size: rightSize,
      crust: rightCrust,
      cheese: rightCheese,
      sauce: rightSauce,
      ingredients: mapIngredientIdsToNames(rightSelectedIngredients),
      price: price, // Use the state price for the right half
      image: rightSelectedPizza && rightSelectedPizza.Image ? rightSelectedPizza.Image : defaultImage,
    };

    const combinedCustomizedPizza = {
      name: 'Half and Half Pizza',
      size: `${size}`, // Example: "Medium / Large"
      ingredients: {
        left: mapIngredientIdsToNames(leftSelectedIngredients),
        right: mapIngredientIdsToNames(rightSelectedIngredients),
      },
      leftPizzaName: leftSelectedPizza ? leftSelectedPizza.Name : 'Custom Pizza',
      rightPizzaName: rightSelectedPizza ? rightSelectedPizza.Name : 'Custom Pizza',
      price: price, // Use the state price for the combined pizza
      quantity: quantity, // Assuming same quantity for both halves
      image: leftSelectedPizza && leftSelectedPizza.Image ? leftSelectedPizza.Image : defaultImage,
    };

    addToCart(combinedCustomizedPizza);
    handleCloseHalfAndHalfPizza();
  };

  useEffect(() => {
    if (leftSelectedPizza) {
      setLeftSize('Large');
      setLeftSelectedIngredients((leftSelectedPizza.DefaultIncrediantIds || []).concat(leftSelectedPizza.FixIncrediantIds || []));
    }
  }, [leftSelectedPizza]);

  useEffect(() => {
    if (rightSelectedPizza) {
      setRightSize('Large');
      setRightSelectedIngredients((rightSelectedPizza.DefaultIncrediantIds || []).concat(rightSelectedPizza.FixIncrediantIds || []));
    }
  }, [rightSelectedPizza]);

  const handleIngredientChange = (id, side) => {
    if (side === 'left') {
      setLeftSelectedIngredients((prevIngredients) =>
        prevIngredients.includes(id)
          ? prevIngredients.filter((ingredientId) => ingredientId !== id)
          : [...prevIngredients, id]
      );
    } else if (side === 'right') {
      setRightSelectedIngredients((prevIngredients) =>
        prevIngredients.includes(id)
          ? prevIngredients.filter((ingredientId) => ingredientId !== id)
          : [...prevIngredients, id]
      );
    }
  };

  const handleQuantityChange = (id, quantity) => {
    setIngredientQuantities(prev => ({ ...prev, [id]: quantity }));
  };
  return (
    <div className='half-and-half-container1'>
     
      <h2>Half and Half Pizza</h2><br />

      <div className='size-quantity-crust'>

        <FormControl fullWidth sx={{ mr: 2 }}>
          <InputLabel htmlFor="size">Size:</InputLabel>
          <Select
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <MenuItem value="Large">Large (Serving size (3-4) Person)</MenuItem>
            <MenuItem value="Extra Large">Extra Large (Serving size (4-6) Person)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth sx={{ mr: 2 }}
          id="quantity"
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />

        <FormControl fullWidth>
          <InputLabel htmlFor="crust">Crust:</InputLabel>
          <Select
            id="crust"
            value={leftCrust}
            onChange={(e) => setLeftCrust(e.target.value)}
          >
            {crusts.map(option => (
              <MenuItem key={option.Id} value={option.Name}>
                {option.Name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div><br /><br />

      <div className="customize-pizza-container">
        <div className="half-container" >
          {/* Left half */}
          <div className="half">
            <h3>Left Half</h3>
            {/* Left half customization options */}
            {/* Include your customization options here using leftSize, leftQuantity, etc. */}
            <div className="customize-pizza-container">
              <div className="pizza-details">
                <div className="pizza-image">
                  {leftSelectedPizza && <h3>{leftSelectedPizza.Name}</h3>}
                  <img src={leftSelectedPizza ? leftSelectedPizza.Image || defaultImage : defaultImage} alt={leftSelectedPizza ? leftSelectedPizza.Name : 'Default Pizza'} />
                </div>
              </div>

              <div className="customization-options">
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select Pizza</InputLabel>
                  <Select
                    value={leftSelectedPizza ? leftSelectedPizza.Id : ''}
                    onChange={(e) => {
                      const pizzaId = e.target.value;
                      const pizza = products.find(p => p.Id === parseInt(pizzaId));
                      setLeftSelectedPizza(pizza);
                      // Since we no longer have setSelectedPizza here, this code would need modification.
                    }}
                  >
                    <MenuItem value="">Select Pizza</MenuItem>
                    {products.filter(p => p.CategoryName === "The Feisty One").map(pizza => (
                      <MenuItem key={pizza.Id} value={pizza.Id}>
                        {pizza.Name}
                      </MenuItem>
                    ))}
                   
                  </Select>
                </FormControl>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel htmlFor="cheese">Cheese:</InputLabel>
                      <Select
                        id="cheese"
                        value={leftCheese}
                        onChange={(e) => setLeftCheese(e.target.value)}
                      >
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="Light">Light</MenuItem>
                        <MenuItem value="Regular">Regular</MenuItem>
                        <MenuItem value="Double">Double</MenuItem>
                        <MenuItem value="Trible">Trible</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel htmlFor="cheese">Cheese:</InputLabel>
                      <Select
                        id="cheese"
                        value={leftCheeses}
                        onChange={(e) => setLeftCheeses(e.target.value)}
                      >
                        {aCheeses.concat(pCheeses).map(option => (
                          <MenuItem key={option.Id} value={option.Name}>
                            {option.Name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel htmlFor="sauce">Sauce:</InputLabel>
                      <Select
                        id="sauce"
                        value={leftSauce}
                        onChange={(e) => setLeftSauce(e.target.value)}
                      >
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="Light">Light</MenuItem>
                        <MenuItem value="Regular">Regular</MenuItem>
                        <MenuItem value="Double">Double</MenuItem>
                        <MenuItem value="Trible">Trible</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel className='sauce-cheese-options' htmlFor="sauces">Sauce:</InputLabel>
                      <Select
                        id="sauces"
                        value={leftSauces}
                        onChange={(e) => setLeftSauces(e.target.value)}
                      >
                        {sauces.map(option => (
                          <MenuItem key={option.Id} value={option.Name}>
                            {option.Name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </div>
            </div>
            <hr />
            <div className="ingredient-lists">
            <div className="cheese-options">
            <h3>Cheese Options:</h3>
        <Grid container spacing={2}>
          {aCheeses.concat(pCheeses).map(ingredient => (
            <Grid item xs={6} sm={3} key={ingredient.Id}>
              <Box boxShadow={3} borderRadius={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id={`cheese-${ingredient.Id}`}
                      name="cheese"
                      checked={leftSelectedIngredients.includes(ingredient.Id)}
                      onChange={() => handleIngredientChange(ingredient.Id, 'right')}
                    />
                  }
                  label={ingredient.Name}
                />
                {leftSelectedIngredients.includes(ingredient.Id) && (
                  <Select
                    value={ingredientQuantities[ingredient.Id] || 'Regular'}
                    onChange={(e) => handleQuantityChange(ingredient.Id, e.target.value)}
                  >
                    <MenuItem value="Light">Light</MenuItem>
                    <MenuItem value="Regular">Regular</MenuItem>
                    <MenuItem value="Double">Double</MenuItem>
                    <MenuItem value="Triple">Triple</MenuItem>
                  </Select>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </div>
      <hr />
      <div className="meat-options">
        <h3>Meat Options:</h3>
        <Grid container spacing={2}>
          {meats.map(ingredient => (
            <Grid item xs={6} sm={3} key={ingredient.Id}>
              <Box boxShadow={3} borderRadius={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id={`meat-${ingredient.Id}`}
                      name="meat"
                      checked={leftSelectedIngredients.includes(ingredient.Id)}
                      onChange={() => handleIngredientChange(ingredient.Id, 'left')}
                    />
                  }
                  label={ingredient.Name}
                />
                {leftSelectedIngredients.includes(ingredient.Id) && (
                  <Select
                    value={ingredientQuantities[ingredient.Id] || 'Regular'}
                    onChange={(e) => handleQuantityChange(ingredient.Id, e.target.value)}
                  >
                    <MenuItem value="Light">Light</MenuItem>
                    <MenuItem value="Regular">Regular</MenuItem>
                    <MenuItem value="Double">Double</MenuItem>
                    <MenuItem value="Triple">Triple</MenuItem>
                  </Select>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </div>
      <hr />
      <div className="veggie-options">
        <h3>Veggie Options:</h3>
        <Grid container spacing={2}>
          {vegetables.map(ingredient => (
            <Grid item xs={6} sm={3} key={ingredient.Id}>
              <Box boxShadow={3} borderRadius={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id={`veggie-${ingredient.Id}`}
                      name="veggie"
                      checked={leftSelectedIngredients.includes(ingredient.Id)}
                      onChange={() => handleIngredientChange(ingredient.Id, 'left')}
                    />
                  }
                  label={ingredient.Name}
                />
                {leftSelectedIngredients.includes(ingredient.Id) && (
                  <Select
                    value={ingredientQuantities[ingredient.Id] || 'Regular'}
                    onChange={(e) => handleQuantityChange(ingredient.Id, e.target.value)}
                  >
                    <MenuItem value="Light">Light</MenuItem>
                    <MenuItem value="Regular">Regular</MenuItem>
                    <MenuItem value="Double">Double</MenuItem>
                    <MenuItem value="Triple">Triple</MenuItem>
                  </Select>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </div>
      <hr />
              
            </div>
          </div>
        </div>

        <div className="right-half-container" style={{ marginLeft: '30px' }}>
          {/* Right half */}
          <div className="half">
            <h3>Right Half</h3>
            {/* Right half customization options */}
            {/* Include your customization options here using rightSize, rightQuantity, etc. */}
            <div className="customize-pizza-container">
              <div className="pizza-details">
                <div className="pizza-image">
                  {rightSelectedPizza && <h3>{rightSelectedPizza.Name}</h3>}
                  <img src={rightSelectedPizza ? rightSelectedPizza.Image || defaultImage : defaultImage} alt={rightSelectedPizza ? rightSelectedPizza.Name : 'Default Pizza'} />

                </div>
              </div>
              <div className="customization-options">
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select Pizza</InputLabel>
                  <Select
                    value={rightSelectedPizza ? rightSelectedPizza.Id : ''}
                    onChange={(e) => {
                      const pizzaId = e.target.value;
                      const pizza = products.find(p => p.Id === parseInt(pizzaId));
                      setRightSelectedPizza(pizza);

                      // Since we no longer have setSelectedPizza here, this code would need modification.
                    }}
                  >
                    <MenuItem value="">Select Pizza</MenuItem>
                    {products.filter(p => p.CategoryName === "The Feisty One").map(pizza => (
                      <MenuItem key={pizza.Id} value={pizza.Id}>
                        {pizza.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel htmlFor="cheese">Cheese:</InputLabel>
                      <Select
                        id="cheese"
                        value={rightCheese}
                        onChange={(e) => setRightCheese(e.target.value)}
                      >
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="Light">Light</MenuItem>
                        <MenuItem value="Regular">Regular</MenuItem>
                        <MenuItem value="Double">Double</MenuItem>
                        <MenuItem value="Trible">Trible</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel htmlFor="cheese">Cheese:</InputLabel>
                      <Select
                        id="cheese"
                        value={rightCheeses}
                        onChange={(e) => setRightCheeses(e.target.value)}
                      >
                        {aCheeses.concat(pCheeses).map(option => (
                          <MenuItem key={option.Id} value={option.Name}>
                            {option.Name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel htmlFor="sauce">Sauce:</InputLabel>
                      <Select
                        id="sauce"
                        value={rightSauce}
                        onChange={(e) => setRightSauce(e.target.value)}
                      >
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="Light">Light</MenuItem>
                        <MenuItem value="Regular">Regular</MenuItem>
                        <MenuItem value="Double">Double</MenuItem>
                        <MenuItem value="Trible">Trible</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel className='sauce-cheese-options' htmlFor="sauces">Sauces:</InputLabel>
                      <Select
                        id="sauces"
                        value={rightSauces}
                        onChange={(e) => setRightSauces(e.target.value)}
                      >
                        {sauces.map(option => (
                          <MenuItem key={option.Id} value={option.Name}>
                            {option.Name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </div>
            </div>
            <hr />
            <div className="ingredient-lists">
      <div className="cheese-options">
        <h3>Cheese Options:</h3>
        <Grid container spacing={2}>
          {aCheeses.concat(pCheeses).map(ingredient => (
            <Grid item xs={6} sm={3} key={ingredient.Id}>
              <Box boxShadow={3} borderRadius={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id={`cheese-${ingredient.Id}`}
                      name="cheese"
                      checked={rightSelectedIngredients.includes(ingredient.Id)}
                      onChange={() => handleIngredientChange(ingredient.Id, 'right')}
                    />
                  }
                  label={ingredient.Name}
                />
                {rightSelectedIngredients.includes(ingredient.Id) && (
                  <Select
                    value={ingredientQuantities[ingredient.Id] || 'Regular'}
                    onChange={(e) => handleQuantityChange(ingredient.Id, e.target.value)}
                  >
                    <MenuItem value="Light">Light</MenuItem>
                    <MenuItem value="Regular">Regular</MenuItem>
                    <MenuItem value="Double">Double</MenuItem>
                    <MenuItem value="Triple">Triple</MenuItem>
                  </Select>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </div>
      <hr />
      <div className="meat-options">
        <h3>Meat Options:</h3>
        <Grid container spacing={2}>
          {meats.map(ingredient => (
            <Grid item xs={6} sm={3} key={ingredient.Id}>
              <Box boxShadow={3} borderRadius={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id={`meat-${ingredient.Id}`}
                      name="meat"
                      checked={rightSelectedIngredients.includes(ingredient.Id)}
                      onChange={() => handleIngredientChange(ingredient.Id, 'right')}
                    />
                  }
                  label={ingredient.Name}
                />
                {rightSelectedIngredients.includes(ingredient.Id) && (
                  <Select
                    value={ingredientQuantities[ingredient.Id] || 'Regular'}
                    onChange={(e) => handleQuantityChange(ingredient.Id, e.target.value)}
                  >
                    <MenuItem value="Light">Light</MenuItem>
                    <MenuItem value="Regular">Regular</MenuItem>
                    <MenuItem value="Double">Double</MenuItem>
                    <MenuItem value="Triple">Triple</MenuItem>
                  </Select>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </div>
      <hr />
      <div className="veggie-options">
        <h3>Veggie Options:</h3>
        <Grid container spacing={2}>
          {vegetables.map(ingredient => (
            <Grid item xs={6} sm={3} key={ingredient.Id}>
              <Box boxShadow={3} borderRadius={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id={`veggie-${ingredient.Id}`}
                      name="veggie"
                      checked={rightSelectedIngredients.includes(ingredient.Id)}
                      onChange={() => handleIngredientChange(ingredient.Id, 'right')}
                    />
                  }
                  label={ingredient.Name}
                />
                {rightSelectedIngredients.includes(ingredient.Id) && (
                  <Select
                    value={ingredientQuantities[ingredient.Id] || 'Regular'}
                    onChange={(e) => handleQuantityChange(ingredient.Id, e.target.value)}
                  >
                    <MenuItem value="Light">Light</MenuItem>
                    <MenuItem value="Regular">Regular</MenuItem>
                    <MenuItem value="Double">Double</MenuItem>
                    <MenuItem value="Triple">Triple</MenuItem>
                  </Select>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </div>
      <hr />
  
                
              </div>            </div>
          </div>
        </div>

      {/* Add to Cart button */}
      <div className="price-container">
      <h4>Price: ${price.toFixed(2) * quantity}</h4>
        <button  onClick={handleAddToCart} >Add to Cart</button>
         </div>
    </div>
  );
}

export default HalfAndHalfPizza;
