import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        questionTitle={t('notificationsPermission.questionTitle')}
        statementQuote={t('notificationsPermission.statementQuote')}
        statementImageKey="timeConstraints"
      />
      
      <SystemPromptOverlay
        visible={showPermissionPrompt}
        title={t('notificationsPermission.overlay.title')}
        body={t('notificationsPermission.overlay.body')}
        onAllow={handleAllowNotifications}
        onDontAllow={handleDontAllowNotifications}
        allowText={t('notificationsPermission.overlay.allowText')}
        dontAllowText={t('notificationsPermission.overlay.dontAllowText')}
        pointerCue="👇"
      />
    </>
  );
}; 