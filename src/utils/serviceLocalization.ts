import { ServiceDetail } from '../types';
import { Language } from '../i18n/types';
import { TAMIL_SERVICES_DATA } from '../i18n/serviceTranslations';

/**
 * Returns a fully localized ServiceDetail object based on active language.
 * In Tamil mode ('ta'), merges rich Tamil titles, descriptions, scopes, notices,
 * benefits, required documents, eligibility, and process steps.
 * In English mode ('en'), returns the original English service definition.
 */
export function getLocalizedService(service: ServiceDetail, language: Language): ServiceDetail {
  if (language !== 'ta') {
    return service;
  }

  const tamilData = TAMIL_SERVICES_DATA[service.id];
  if (!tamilData) {
    return service;
  }

  return {
    ...service,
    title: tamilData.title,
    categoryTitle: tamilData.categoryTitle,
    shortDescription: tamilData.shortDescription,
    detailedScope: tamilData.detailedScope,
    complianceNotice: tamilData.complianceNotice || service.complianceNotice,
    whoItIsFor: tamilData.whoItIsFor || service.whoItIsFor,
    problemsItSolves: tamilData.problemsItSolves || service.problemsItSolves,
    deliverables: tamilData.deliverables || service.deliverables,
    processSteps: tamilData.processSteps || service.processSteps,
    whatsappMessage: tamilData.whatsappMessage || service.whatsappMessage,
    startingPriceLabel: tamilData.pricingLabel || service.startingPriceLabel
  };
}

/**
 * Returns a localized list of services
 */
export function getLocalizedServices(services: ServiceDetail[], language: Language): ServiceDetail[] {
  return services.map((s) => getLocalizedService(s, language));
}
