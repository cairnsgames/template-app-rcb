import { useTranslation } from 'react-i18next';

const LoyaltyRewards = ({data}) => {
    const { t } = useTranslation();

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
    return (
        <div>
            <p>{t('loyalty.unclaimedRewards')}: {notRedeemedCount}</p>
            <p>{t('loyalty.redeemedRewardsCount')}: {redeemedCount}</p>
        </div>
    );
}

export default LoyaltyRewards;