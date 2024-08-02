import React, { useEffect, useState } from "react";
import CartToOrder from "../../packages/breezo/breezocarttoorder";
import PageCentered from "../../parts/pagelayouts/pagecentered";

const PlaceOrderPage = () => {
  return (    
    <PageCentered>
        <CartToOrder />
    </PageCentered>
  );
};

export default PlaceOrderPage;
