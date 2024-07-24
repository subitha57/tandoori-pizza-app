import React, { useState } from 'react';
import { FormControlLabel, Checkbox, Grid, Box } from '@mui/material';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';

const IngredientOptions = ({ options, selectedIngredients, handleIngredientChange, isDefaultIngredient }) => {
  return (
    <Grid container spacing={2}>
      {options.map(option => (
        <Grid item xs={6} sm={3} key={option.Id}>
          <Box boxShadow={3} borderRadius={2}>
            <FormControlLabel
              control={
                <Checkbox
                  id={`${option.Type}-${option.Id}`}
                  name={option.Type}
                  checked={selectedIngredients.includes(option.Id)}
                  onChange={() => handleIngredientChange(option.Id)}
                />
              }
              label={option.Name}
            />
            {isDefaultIngredient(option.Id) && !selectedIngredients.includes(option.Id) && (
              <DoNotDisturbIcon color="error" />
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default IngredientOptions;
