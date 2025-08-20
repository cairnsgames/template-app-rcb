import React from "react";
import { Button, Image } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import useUser from "../../../../packages/auth/context/useuser";
import FavIcon from "../../../svg/favicon";

const Hero = ({ openSignup, roles }) => {
  const { t } = useTranslation();
  const { isLoggedIn } = useUser();

  if (roles.length > 0) {
    return (
      <div className="my-5 text-center">
        {/* <Image className="mb-4" src="./favicon.png" alt="" width="72" /> */}
        <FavIcon  className="me-3" size={128} color={"purple"} lineWidth="3" />
        <h1 className="display-5 fw-bold">{t('landingPage.welcomePartner')}</h1>
        <div className="w-75 mx-auto">
          {isLoggedIn && (
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
              <Button
                variant="primary"
                size="lg"
                className="mt-3"
                onClick={openSignup}
              >
                {t('landingPage.updatePartnerDetails')}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="my-5 text-center">
      <Image className="mb-4" src="./favicon.png" alt="" width="72" />
      <h1 className="display-5 fw-bold">{t('landingPage.partnerWithUs')}</h1>
      <div className="w-75 mx-auto">
        <p className="lead mb-4">
          {t('landingPage.partnerDescription')}
        </p>
        {isLoggedIn && (
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Button
              variant="primary"
              size="lg"
              className="mt-3"
              onClick={openSignup}
            >
              {t('landingPage.becomePartnerButton')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
