# SCRUM-101 Checkout Test Execution Report

## Executive Summary

| Measure | Result |
| --- | --- |
| Planned exploratory scenarios | 10 |
| Manual scenarios executed | 10 |
| Manual results | 6 pass, 4 fail |
| Automated test cases | 11 |
| Automated executions | 33 (11 tests across Chromium, Firefox, and WebKit) |
| Automated results | 21 pass, 12 fail |
| Overall status | **FAIL** — checkout requirements are not fully met |

The same four requirement failures reproduced in all three browser projects. The test scripts are stable, and the failures match behavior observed manually. The application under test is SauceDemo (`https://www.saucedemo.com`); no application source code is present in this workspace to fix these product defects.

## Manual Test Results

| # | Scenario | Result | Observation |
| --- | --- | --- | --- |
| 1 | Cart review with two selected products | **FAIL** | Item names, descriptions, prices, quantities, Continue Shopping, and Checkout were present. The cart did not show the requested total-price calculation. |
| 2 | Submit checkout with all information fields empty | **PASS** | Stayed on the information page and showed `First Name is required`. |
| 3 | Submit with Last Name empty | **PASS** | Stayed on the information page and showed `Last Name is required`. |
| 4 | Submit with Zip/Postal Code empty | **PASS** | Stayed on the information page and showed `Postal Code is required`. |
| 5 | Submit special characters in First Name | **FAIL** | `!@#` was accepted and the application advanced to checkout overview; no validation error was shown. |
| 6 | Review order, payment, shipping, and calculated totals | **PASS** | Backpack plus Bike Light showed item total `$39.98`, tax `$3.20`, and total `$43.18`, with payment and shipping information. |
| 7 | Cancel checkout from overview | **FAIL** | Cancel returned to the product inventory rather than the cart; the cart remained populated. |
| 8 | Finish order and return home | **PASS** | Confirmation displayed `Thank you for your order!`; cart showed empty; Back Home returned to products. |
| 9 | Empty-cart and unauthenticated checkout guards | **FAIL (empty cart)** / **PASS (login guard)** | Checkout was enabled for an empty cart and advanced to checkout information. A logged-out direct checkout URL redirected to login with an access error. |
| 10 | Mobile checkout at 390×844 | **PASS** | Cart, form, overview totals, and actions fit the tested viewport without horizontal overflow. |

The empty-cart scenario is marked failed because its business-rule requirement was violated, even though the authentication guard passed.

### Screenshots

- Cart review: [cart-review.png](../cart-review.png)
- Order confirmation: [checkout-confirmation.png](../checkout-confirmation.png)
- Mobile checkout information: [checkout-mobile-information.png](../checkout-mobile-information.png)
- Mobile checkout overview: [checkout-mobile-overview.png](../checkout-mobile-overview.png)

## Automated Test Results

The suite was run against the projects configured in `playwright.config.ts`.

| Browser project | Tests | Passed | Failed |
| --- | ---: | ---: | ---: |
| Chromium | 11 | 7 | 4 |
| Firefox | 11 | 7 | 4 |
| WebKit | 11 | 7 | 4 |
| **Total** | **33** | **21** | **12** |

### Failure summary

Each of the following failures reproduced in Chromium, Firefox, and WebKit:

1. Cart review expects the two-item total `$39.98`; no total is displayed on the cart page.
2. Empty-cart checkout expects to remain on the cart; it advanced to `checkout-step-one.html`.
3. Overview cancellation expects to return to the cart; it navigated to `inventory.html`.
4. Invalid special-character input expects validation; `!@#` was accepted and advanced to `checkout-step-two.html`.

All required-field validation tests passed, as did overview calculations, successful order completion/cart clearing, the unauthenticated redirect, and the mobile viewport scenario.

### Healing activities

The requested custom planner and generator agent invocations could not start because their agent definitions specify `Claude Sonnet 4.6`, which is not an available model in this environment. The planner MCP tools were used to explore and save the plan; the Playwright test MCP runner executed the generated suites.

The test-healer agent invocation was also unavailable for the same model configuration. The 12 failing executions were inspected against manual browser evidence. They are application/acceptance-criteria mismatches rather than broken selectors, timing, or assertions, so no test was weakened or marked passing. There were no test-code healing changes to rerun.

## Defects Log

| Bug ID | Severity | Area | Description | Evidence |
| --- | --- | --- | --- | --- |
| SCRUM-101-BUG-001 | Medium | AC1 — Cart review | Cart page omits the required total-price calculation for its items. | `cart-review.spec.js` fails to find `$39.98`; see [cart screenshot](../cart-review.png). |
| SCRUM-101-BUG-002 | Medium | AC5 — Input validation | Special characters in First Name are accepted without validation; checkout proceeds. | `checkout-validation.spec.js` reaches the overview with `!@#`. |
| SCRUM-101-BUG-003 | Medium | Checkout business rule | Cancel from overview returns to inventory rather than the cart. | `checkout-overview.spec.js` receives `inventory.html` instead of `cart.html`. |
| SCRUM-101-BUG-004 | Medium | Empty-cart business rule | Empty cart still exposes a working Checkout action and advances to checkout information. | `checkout-guards.spec.js` receives `checkout-step-one.html` instead of `cart.html`. |

## Test Coverage Analysis

| Requirement | Manual coverage | Automated coverage | Assessment |
| --- | --- | --- | --- |
| AC1 — Cart items, details, total, and actions | Item details/actions verified; total missing | Cart review test covers items, prices, actions, and total | **Partial; total requirement fails** |
| AC2 — Information page and mandatory fields | All three missing-field cases exercised | First Name, Last Name, and postal-code tests | **Covered; passing** |
| AC3 — Order overview and controls | Item summary, payment, shipping, and totals verified; Cancel destination fails | Totals and Cancel tests | **Partial; Cancel destination fails** |
| AC4 — Order completion | Confirmation, empty cart, and Back Home verified | Completion test covers confirmation, cart clearing, and return home | **Covered; passing** |
| AC5 — Invalid input feedback | Special-character input was accepted | Invalid-input test reproduces acceptance | **Covered; failing** |
| Business rule — Empty cart | Checkout attempted with no items | Empty-cart guard test | **Covered; failing** |
| Business rule — Login required | Direct URL after logout redirected to login | Unauthenticated guard test | **Covered; passing** |
| Mobile responsiveness | Checkout information and overview at 390×844 | Mobile layout and horizontal-overflow assertion | **Covered at one viewport** |

### Gaps and recommendations

- Fix the four logged defects and rerun the existing cross-browser suite.
- Expand invalid-data validation cases beyond special characters (for example, whitespace-only values and postal-code formats); current acceptance criteria do not define a complete postal-code format.
- Add additional mobile device/browser combinations; the current responsive check uses one viewport.
- Consider validating the cart total before checkout, rather than showing calculations only on the overview.
- Verify cancellation navigation at each checkout stage and confirm cart persistence after returning.

## Summary and Recommendations

The happy-path checkout, field-required validation, login protection, overview calculations, order confirmation, and tested mobile layout work in all configured browser projects. The cart total, special-character validation, overview cancellation destination, and empty-cart guard are unmet requirements and block acceptance.

**Recommendation:** resolve SCRUM-101-BUG-001 through SCRUM-101-BUG-004, then rerun all 11 tests in Chromium, Firefox, and WebKit. Do not treat the current 21 passing automated executions as a release pass while the 12 requirement-failing executions remain.
