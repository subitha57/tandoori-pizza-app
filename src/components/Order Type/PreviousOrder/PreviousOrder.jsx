import React, { useState, useEffect } from 'react';
import './PreviousOrder.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const AllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://test.tandooripizza.com/api/online/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data.Data); // Assuming data structure matches your provided JSON
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Handle error state or notification to the user
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchOrders();
  }, []);

  const handleViewClick = (orderId) => {
    console.log('View button clicked for order ID:', orderId);
    navigate(`/order/${orderId}`);
  };

  const handleBackClick = () => {
    navigate('/Home'); // Navigate to the home page
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width={200}
          height={200}
          bgcolor="lightgray"
          borderRadius={4}
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Loading...
          </Typography>
        </Box>
      </Box>
    ); // Using Material-UI CircularProgress component inside a styled Box with loading text
  }

  return (
    <div>
      <h2>All Orders</h2>
      <button className="back-button" onClick={handleBackClick}>Back</button>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Order Type</th>
              <th>Date Ordered</th>
              <th>Promise Date</th>
              <th>Order Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <React.Fragment key={order.order.ID}>
                {order.order.OrderItems.map((item, index) => (
                  <tr key={item.ID}>
                    {index === 0 && (
                      <React.Fragment>
                        <td rowSpan={order.order.OrderItems.length}>{order.order.ID}</td>
                        <td rowSpan={order.order.OrderItems.length}>{order.order.Status === 1 ? 'Delivery' : 'Pickup'}</td>
                        <td rowSpan={order.order.OrderItems.length}>{new Date(order.order.PlacedOn).toLocaleDateString()}</td>
                        <td rowSpan={order.order.OrderItems.length}>{new Date(order.order.PromiseDate).toLocaleDateString()}</td>
                        <td rowSpan={order.order.OrderItems.length}>{order.order.TotalAmmount}</td>
                      </React.Fragment>
                    )}
                    {index === 0 && (
                      <td rowSpan={order.order.OrderItems.length}>
                        <button onClick={() => handleViewClick(order.order.ID)}>View</button>
                      </td>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrder;
