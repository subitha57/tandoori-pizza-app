import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './OrderDetails.css';

const ViewOrderDetails = () => {
  const { orderID } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`https://test.tandooripizza.com/api/online/order/get/${orderID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderID: orderID,
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrderDetails(data.Data);
        console.log('Order details fetched:', data.Data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('There is no order'); // Set error message for display
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    alert(error); // Show alert with error message
    navigate(-1); // Navigate back to the previous page
    return null; // Return null to render nothing
  }

  const { order } = orderDetails;

  return (
    <div className="order-details-container">
      <h2>View Order Details</h2><br/>
      <button className="close-button" onClick={() => navigate(-2)}>Back</button>
      <div className="order-details-content">
        <div className="order-details-left">
          <div>
            <h3>Products:</h3>
            {order.OrderItems.map((item, index) => (
              <p key={index}>
                {item.ProductName} - ${item.ItemPrice.toFixed(2)}
              </p>
            ))}
          </div>
          <div>
            <h3>Total Amount:</h3>
            <p>{order.TotalAmmount}</p>
          </div>
          <div>
            <h3>Delivery Charges:</h3>
            <p>{order.DeliveryCharges}</p>
          </div>
          <div>
            <h3>Tax:</h3>
            <p>{order.Tax}</p>
          </div>
          <div>
            <h3>Final Amount:</h3>
            <p>{order.FinalAmmount}</p>
          </div>
        </div>
        <div className="order-details-right">
          <h3>Order Details for Order ID: {orderID}</h3>
          <div className="order-info">
            <p><strong>Type:</strong> {order.Status === 1 ? 'Delivery' : 'Pickup'}</p><br/>
            <p><strong>Order Date:</strong> {new Date(order.PlacedOn).toLocaleString()}</p><br/>
            <p><strong>Promise Date:</strong> {new Date(order.PromiseDate).toLocaleString()}</p><br/>
            <p><strong>Full Name:</strong> {order.CustomerName || 'N/A'}</p><br/>
            <p><strong>Email:</strong> {order.CustomerEmail || 'N/A'}</p><br/>
            <p><strong>Phone Number:</strong> {order.CustomerPhone || 'N/A'}</p><br/>
            <p><strong>Address:</strong> {order.CustomerAddress || 'N/A'}</p><br/>
          </div><br/>
          <h3>Payment Details</h3><br/>
          <div className="payment-info">
            <p><strong>Card Holder Name:</strong> {order.PaymentMethod === 1 ? 'Cash' : 'Credit Card'}</p><br/>
            <p><strong>Card Number:</strong> {order.TransactionID || 'N/A'}</p><br/>
            <p><strong>Card Issuer:</strong> {order.CCName || 'N/A'}</p><br/>
            <p><strong>Zip Code:</strong> {order.CustomerZipCode || 'N/A'}</p><br/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderDetails;
