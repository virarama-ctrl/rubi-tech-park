import test from 'node:test';
import assert from 'node:assert/strict';
import { formatINR, calculateStartingEstimate } from './pricing';
import { AGENCY_CONFIG } from '../config/agencyConfig';

test('formatINR formats currency with rupee symbol', () => {
  const formatted5k = formatINR(5000);
  assert.ok(formatted5k.includes('5,000'));
  assert.ok(formatted5k.includes('₹'));

  const formatted15k = formatINR(15000);
  assert.ok(formatted15k.includes('15,000'));
});

test('calculateStartingEstimate returns correct starting baseline', () => {
  const webEst = calculateStartingEstimate('business-website');
  assert.equal(webEst.estimatedStartingPrice, AGENCY_CONFIG.startingPrices.businessWebsite);
  assert.equal(webEst.estimatedStartingPrice, 5000);

  const ecomEst = calculateStartingEstimate('ecommerce-store');
  assert.equal(ecomEst.estimatedStartingPrice, AGENCY_CONFIG.startingPrices.ecommerceWebsite);
  assert.equal(ecomEst.estimatedStartingPrice, 15000);

  const crmEst = calculateStartingEstimate('custom-crm');
  assert.equal(crmEst.estimatedStartingPrice, AGENCY_CONFIG.startingPrices.customCRM);
  assert.equal(crmEst.estimatedStartingPrice, 20000);

  const integratedEst = calculateStartingEstimate('website-crm-integration');
  assert.equal(integratedEst.estimatedStartingPrice, AGENCY_CONFIG.startingPrices.websitePlusCRM);
  assert.equal(integratedEst.estimatedStartingPrice, 30000);
});

test('calculateStartingEstimate incorporates scope factors and disclaimer', () => {
  const result = calculateStartingEstimate('business-website', { scopeSize: 'expanded' });
  assert.equal(result.estimatedStartingPrice, 9000);
  assert.ok(result.disclaimer.includes('indicative starting baseline'));
  assert.ok(result.factors.length > 0);
});
