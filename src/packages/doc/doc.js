import React from 'react';
import OrderSummary, {orderData} from './order';

const Doc = (props) => {
    return <div className="packagesDoc">
        <p>Doc component</p>
        <OrderSummary order={orderData}/>
    </div>
}

export default Doc;