import React, { useState } from 'react';
import { SurveyStatementYN } from './SurveyStatementYN';
import { SystemPromptOverlay } from '../design-system/organisms/SystemPromptOverlay';
import { ImageUrls } from '../../utils/imageUrls';

interface NotificationsPermissionExplainProps {
  onContinue: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export const NotificationsPermissionExplain: React.FC<NotificationsPermissionExplainProps> = ({
  onContinue,
  onBack,
  currentStep,
  totalSteps,
}) => {
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  const handleYes = () => {
    // Show the iOS notification permission prompt
    setShowPermissionPrompt(true);
  };

  const handleNo = () => {
    // Skip notifications and continue
    onContinue();
  };

  const handleAllowNotifications = () => {
    setShowPermissionPrompt(false);
    // In a real app, you would request actual notification permissions here
    console.log('Notifications allowed');
    onContinue();
  };

  const handleDontAllowNotifications = () => {
    setShowPermissionPrompt(false);
    console.log('Notifications declined');
    onContinue();
  };

  return (
    <>
      <SurveyStatementYN
        onYes={handleYes}
        onNo={handleNo}
        onBack={onBack}
        currentStep={currentStep}
        totalSteps={totalSteps}
        questionTitle="Would you like daily reminders to stay on track?"
        statementQuote="I keep forgetting to stick to my skincare routine and always lose motivation after a few days."
        statementImageKey="timeConstraints"
      />
      
      <SystemPromptOverlay
        visible={showPermissionPrompt}
                  title="Dymz AI would like to send you notifications"
        body="Notifications may include alerts, sounds, and icon badges. These can be configured in Settings."
        onAllow={handleAllowNotifications}
        onDontAllow={handleDontAllowNotifications}
        allowText="Allow"
        dontAllowText="Don't Allow"
        pointerCue="👇"
      />
    </>
  );
}; 