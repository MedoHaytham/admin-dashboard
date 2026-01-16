"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';


function Products() {

  const [orderData, setOrderData] =useState([])

  useEffect(() => {
    async function fetchOrders() {
      try {
        const resones1 = await fetch('https://dummyjson.com/carts?limit=50&sortBy=total');
        const cartData = await resones1.json();
        const orderData = await Promise.all( 
          cartData.carts.map( async (cart) => {
            const respone2 = await fetch(`https://dummyjson.com/users/${cart.userId}`);
            const userData = await respone2.json();

            return {
              id: cart.id,
              client: userData.firstName + ' ' + userData.lastName,
              email: userData.email,
              total: cart.total,
              status: ['Delivered', 'Pending', 'Canceled'][cart.id % 3],
              date: new Date().toDateString(),
              city: userData.address.city 
            };
          })
        );
        setOrderData(orderData);
      } catch (error) {
        toast.error('Error on fetch orders' + error);
      }
    }
    fetchOrders();
  },[]);

console.log(orderData);

  return (
    <div>Orders</div>
  )
}

export default Products