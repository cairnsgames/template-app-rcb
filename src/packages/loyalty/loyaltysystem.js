import React, { useContext, useEffect } from 'react';
import { LoyaltyContext, LoyaltyProvider } from './loyaltyprovider';
import { useUser } from '../auth/context/useuser';

const Loyalty = () => {
    const { setUser, systems, selectSystem, cards, rewards, createNewCard, addNewStamp } = useContext(LoyaltyContext);
    const { user } = useUser();

    if (!user) {
        return <div>Loading user...</div>;
    }

    return (
        <div>
            <h1>Welcome, {user.name}</h1>
            <h2>Your Systems ({systems?.count ?? "Loading"})</h2>
            <ul>
                {systems?.map(system => (
                    <li key={system.id} onClick={() => selectSystem(system.id)}>
                        {system.name}
                    </li>
                ))}
            </ul>
            {cards?.length > 0 && (
                <>
                    <h2>Your Cards</h2>
                    <ul>
                        {cards?.map(card => (
                            <li key={card.id}>
                                Card ID: {card.id}, Stamps: {card.stamps_collected}
                                <button onClick={() => addNewStamp(card.id)}>Add Stamp</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {rewards?.length > 0 && (
                <>
                    <h2>Your Rewards</h2>
                    <ul>
                        {rewards?.map(reward => (
                            <li key={reward.id}>
                                {reward.reward_description} - Earned: {reward.date_earned} - Redeemed: {reward.date_redeemed}
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <button onClick={() => createNewCard(user.id, selectedSystemId)}>Create New Card</button>
        </div>
    );
};

export default Loyalty;
