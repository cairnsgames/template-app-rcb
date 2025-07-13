import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

const CallToAction = ({ showSignup }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-light my-3 py-5 text-center">
      <h2 className="display-6">{t('landingPage.callToActionTitle')}</h2>
      <p className="lead">{t('landingPage.callToActionDescription')}</p>
      <Button variant="primary" size="lg" className="mt-3" onClick={showSignup}>
        {t('landingPage.becomePartnerButton')}
      </Button>
    </div>
  );
};

export default CallToAction;
