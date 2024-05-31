import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ProgressBar,
  ButtonGroup,
} from "react-bootstrap";
import CustomButton from "../wizard2/custombutton";

const Wizard = ({ children, onSave, lastActiveStep }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const steps = React.Children.toArray(children);
  const totalSteps = steps.length;
  const currentStepComponent = steps[currentStep];

  const progressPercentage = ((currentStep / (totalSteps - 1)) * 100).toFixed(
    0
  );

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCompletedSteps((prev) => new Set(prev).add(currentStep));
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index) => {
    if (index < totalSteps) {
      setCurrentStep(index);
    }
  };

  return (
    <>
      <Row>
        <Col>
          <div className="button-group-container">
            <ButtonGroup className="w-100">
              {steps.map((step, index) => (
                <CustomButton
                  key={index}
                  className={`step-button ${
                    index === currentStep
                      ? "active"
                      : index <= currentStep || completedSteps.has(index)
                      ? "completed"
                      : ""
                  }`}
                  disabled={index+1 > lastActiveStep}
                  onClick={() => goToStep(index)}
                >
                  {step.props.title}
                </CustomButton>
              ))}
            </ButtonGroup>
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <ProgressBar
            now={progressPercentage}
            label={`${progressPercentage}%`}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>{currentStepComponent}</Col>
      </Row>
      <Row className="mt-3">
        <Col>
          {currentStep > 0 && (
            <Button variant="secondary" onClick={previousStep}>
              Back
            </Button>
          )}
          {currentStep < totalSteps - 1 ? (
            <Button
              variant="primary"
              onClick={nextStep}
              className="ml-2"
              disabled={Number(currentStep+1) > Number(lastActiveStep)}
            >
              Next
            </Button>
          ) : (
            <Button variant="success" onClick={onSave} className="ml-2">
              Save
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
};

const Step = ({ children }) => {
  return <>{children}</>;
};

const StepTitle = ({ children }) => {
  return <>{children}</>;
};

Wizard.Step = Step;
Wizard.StepTitle = StepTitle;

export default Wizard;
