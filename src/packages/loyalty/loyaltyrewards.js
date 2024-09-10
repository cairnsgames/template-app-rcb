const LoyaltyRewards = ({data}) => {
    console.log('Rewards data:', data);
    
    let redeemedCount = 0;
    let notRedeemedCount = 0;
    
    // Iterate through the rewards and count based on date_redeemed
    data.forEach(data => {
        if (data.date_redeemed) {
            redeemedCount++;
        } else {
            notRedeemedCount++;
        }
    });
    return (<div>
        <p>Unclaimed rewards: {notRedeemedCount}</p>
        <p>Number of rewards already redeemed: {redeemedCount}</p>
        </div>);
}

export default LoyaltyRewards;