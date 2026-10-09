# SCRUM-101 Checkout Test Execution Report

## Executive Summary

| Measure | Result |
| --- | --- |
| Planned test scenarios | 13 across six suites |
| Manual testing | Original 10 scenarios plus five follow-up exploratory checks |
| Automated cases | 18 |
| Full cross-browser run | 54 executions: 39 passed, 15 failed |
| Focused Haiku happy-path retest | 3 executions: 3 passed |
| Combined validation executions | 57: 42 passed, 15 failed |
| Overall status | **FAIL** — five checkout requirements remain unmet |

The same five requirement failures reproduced in Chromium, Firefox, and WebKit. The focused cross-browser rerun of the repaired Haiku-generated order-completion test passed in all three browsers. The app is SauceDemo at https://www.saucedemo.com; test account is `standard_user`.

## Manual Test Results

The planner refreshed the scenario plan in [saucedemo-checkout-test-plan.md](../specs/saucedemo-checkout-test-plan.md). Manual browser checks exercised the planned checkout flow and the additional cancellation, back-navigation, and whitespace cases.

| Scenario/check | Result | Observation |
| --- | --- | --- |
| Cart shows item names, descriptions, prices, quantities and actions | **Pass** | Details and actions were visible for selected products. |
| Cart displays calculated item total | **Fail** | No total calculation appeared in cart. |
| Continue Shopping preserves selected cart items | **Pass** | Returned to inventory with the item still in the cart badge. |
| Empty First Name | **Pass** | Required-field error identified First Name. |
| Empty Last Name | **Pass** | Required-field error identified Last Name. |
| Empty Zip/Postal Code | **Pass** | Required-field error identified Postal Code. |
| Special characters in First Name | **Fail** | `!@#` was accepted and advanced to overview. |
| Whitespace-only First Name | **Fail** | Three spaces were accepted and advanced to overview. |
| Valid information and order overview | **Pass** | Two-item order showed $39.98 item total, $3.20 tax, and $43.18 total, plus payment/shipping data. |
| Cancel from checkout information | **Pass** | Returned to cart with item preserved. |
| Browser Back from checkout information | **Pass** | Returned to cart with item preserved. |
| Browser Back from overview | **Pass** | Returned to checkout information; cart badge remained populated. |
| Cancel from overview | **Fail** | Returned to inventory instead of cart; items remained available. |
| Checkout with empty cart | **Fail** | Checkout action advanced to checkout information. |
| Logged-out direct checkout access | **Pass** | Redirected to login with an access error. |
| Finish, confirmation, and cart clearing | **Pass** | Confirmation displayed; cart was empty; Back Home returned to inventory. |
| Mobile checkout at 390×844 | **Pass** | Form, cart, totals and controls were usable with no horizontal overflow. |

### Screenshot evidence

- [Cart review](../cart-review.png)
- [Order confirmation](../checkout-confirmation.png)
- [Mobile checkout information](../checkout-mobile-information.png)
- [Mobile checkout overview](../checkout-mobile-overview.png)

## Automated Test Results

The refreshed suite contains 18 test cases run in each configured browser project:

| Project | Test executions | Passed | Failed |
| --- | ---: | ---: | ---: |
| Chromium | 18 | 13 | 5 |
| Firefox | 18 | 13 | 5 |
| WebKit | 18 | 13 | 5 |
| **Full suite total** | **54** | **39** | **15** |

The five failures in every project are:

1. Cart review total calculation is missing.
2. Empty cart is allowed to proceed to checkout.
3. Overview Cancel returns to inventory instead of cart.
4. Special characters in First Name are accepted.
5. Whitespace-only First Name is accepted.

All other full-suite tests passed, including the navigation suite (Continue Shopping, checkout-information Cancel, and browser Back), required-field checks, valid order overview, login guard, successful order completion, and mobile layout. The Haiku-generated happy-path test was also retested separately by the healer in Chromium, Firefox, and WebKit; all three passed. That focused retest is separate from the 54 full-suite executions.

## Agent Activities

- **Planner (`claude-haiku-4.5`):** refreshed and saved the plan with explicit mappings to six test suites, full acceptance criteria, expected defect validations, mobile coverage, and cancellation/back-navigation scenarios.
- **Generator (`claude-haiku-4.5`):** generated [checkout-navigation.spec.js](../tests/saucedemo-checkout/checkout-navigation.spec.js) with three navigation scenarios. The generator also supplied the existing Haiku order-completion test.
- **Healer (`claude-haiku-4.5`):** identified a genuine ambiguous locator in the Haiku-generated test: its accessible-name selector matched both image and title links. The test was narrowed to the stable `[data-test="item-4-title-link"]` locator without changing intent. The test then passed in all three browsers. The healer confirmed the remaining failures reflect application behavior, so their assertions were retained.

## Defects Log

| Bug ID | Severity | Requirement | Finding |
| --- | --- | --- | --- |
| SCRUM-101-BUG-001 | Medium | AC1 — Cart review | Cart page does not display the total price calculation. |
| SCRUM-101-BUG-002 | Medium | AC5 — Input validation | Special characters in First Name are accepted and checkout proceeds. |
| SCRUM-101-BUG-003 | Medium | AC5 / Business rule — Input validation | Whitespace-only First Name is accepted and checkout proceeds. |
| SCRUM-101-BUG-004 | Medium | Business rule — Checkout cancellation | Overview Cancel returns to inventory rather than the cart. |
| SCRUM-101-BUG-005 | Medium | Business rule — Empty cart | Checkout is allowed to advance with an empty cart. |

## Coverage Analysis and Recommendations

- **AC1:** Cart products, details, quantities, prices, and navigation are covered. Total display remains a reproducible failure.
- **AC2:** Each blank required field has field-specific automated validation coverage; tests pass.
- **AC3:** Overview items, payment/shipping, and amount calculations pass. Overview Cancel destination fails.
- **AC4:** Confirmation, cart clearing, and Back Home are covered and pass.
- **AC5:** Special-character and whitespace-only invalid-input checks fail because both values are accepted. Required blank-field checks pass.
- **Business rules:** Login protection passes; empty-cart guard and overview cancellation fail. Checkout-information cancellation and browser Back paths pass.
- **Responsive behavior:** Mobile coverage passes at 390×844; add other viewport sizes and mobile browser projects for broader confidence.

Fix SCRUM-101-BUG-001 through SCRUM-101-BUG-005, then rerun all three browser projects. Keep the defect assertions strict until application behavior meets the story. Clarify acceptable postal-code formats before adding format-specific validation cases.

**Release assessment: not ready for acceptance** while the five defects remain.
