# SCRUM-101 Checkout Test Execution Report

## Executive Summary

The SauceDemo checkout was tested against the story at `user-stories/ecommerce-checkout.md`.

| Measure | Result |
| --- | --- |
| Planned exploratory scenarios | 10 |
| Manual scenarios exercised | 10 |
| Cross-browser suite | 11 test cases in Chromium, Firefox, and WebKit |
| Cross-browser result | 21 passed, 12 failed (33 executions) |
| Additional generator tests | 2 successful checkout tests, each passed in a separate Chromium run |
| Overall status | **FAIL** — four acceptance/business requirements remain unmet |

Application: https://www.saucedemo.com. Test user: `standard_user` (the password is in the story and is not repeated in this report).

## Manual Test Results

| Scenario | Result | Observation |
| --- | --- | --- |
| Review cart items, detail, prices and actions | **Fail** | Product details, quantities, prices, Continue Shopping and Checkout were present, but the cart did not show the requested total. |
| Submit all checkout fields empty | **Pass** | Error identified First Name as required. |
| Leave Last Name empty | **Pass** | Error identified Last Name as required. |
| Leave postal code empty | **Pass** | Error identified Postal Code as required. |
| Enter special characters in First Name | **Fail** | `!@#` was accepted and checkout advanced to the overview. |
| Review order overview | **Pass** | Two-item cart displayed item total `$39.98`, tax `$3.20`, and total `$43.18`, along with payment and shipping details. |
| Cancel from overview | **Fail** | Returned to inventory rather than cart. |
| Complete order and return home | **Pass** | Confirmation displayed, cart was empty, and Back Home returned to inventory. |
| Empty-cart / logged-out access | **Fail / Pass** | Empty-cart checkout proceeded to checkout information; logged-out direct access redirected to login. |
| Mobile checkout at 390×844 | **Pass** | Form and overview were usable without horizontal overflow. |

### Screenshots

- [Cart review](../cart-review.png)
- [Order confirmation](../checkout-confirmation.png)
- [Mobile checkout information](../checkout-mobile-information.png)
- [Mobile checkout overview](../checkout-mobile-overview.png)

## Automated Results

The original 11-test suite was executed in all three configured browser projects:

| Project | Executions | Passed | Failed |
| --- | ---: | ---: | ---: |
| Chromium | 11 | 7 | 4 |
| Firefox | 11 | 7 | 4 |
| WebKit | 11 | 7 | 4 |
| **Total** | **33** | **21** | **12** |

Four failures repeated in each browser: missing cart total, empty-cart checkout allowed, overview cancellation navigates to inventory, and special characters accepted. Required-field checks, overview totals, order completion, authentication redirect, and mobile viewport checks passed.

Two additional generator-produced happy-path tests were each run separately in Chromium and passed. The healer also ran the suite again and debugged representative failures. Its runner output was truncated; it reported 5 passing and 4 failing tests across the four requested specs. The failure traces confirmed application behavior mismatches; the test assertions were left unchanged. That truncated rerun is not included in the 33-execution table above.

## Agent Activities and Limits

The planner, generator, and healer custom agents were invoked with the explicit `claude-haiku-4.5` model:

- **Planner:** explored the live site and verified field validation and the successful order totals. The agent reported its context had no workspace file-reading access, so it did not update the plan file. The previously generated test plan remains in `specs/saucedemo-checkout-test-plan.md`.
- **Generator:** created `tests/saucedemo-checkout/agent-haiku-order-completion.spec.js`; it passed when run in Chromium.
- **Healer:** reran and debugged the cart total, empty-cart guard, cancellation, and special-character failures. It found application requirement mismatches, not automation defects. No assertions were weakened or marked as skipped.

## Defects Log

| Bug ID | Severity | Requirement | Finding |
| --- | --- | --- | --- |
| SCRUM-101-BUG-001 | Medium | AC1 — Cart review | Cart does not display the total price for its items. |
| SCRUM-101-BUG-002 | Medium | AC5 — Input validation | Special characters in First Name are accepted and checkout proceeds. |
| SCRUM-101-BUG-003 | Medium | Checkout cancellation | Overview Cancel returns to inventory rather than the cart. |
| SCRUM-101-BUG-004 | Medium | Empty-cart business rule | Checkout is allowed to advance with an empty cart. |

## Coverage and Recommendations

Required-field validation and the successful order path are covered and passed. The cart-total, invalid-input, overview-cancel, and empty-cart requirements are covered by assertions that fail against current behavior. Login protection passed. Mobile coverage is limited to one viewport.

Resolve SCRUM-101-BUG-001 through SCRUM-101-BUG-004 and rerun the full three-browser suite. Add whitespace-only and postal-format validation cases once the product requirement defines accepted formats; add further mobile viewports and cancellation checks at each checkout stage.

**Release assessment: not ready for acceptance** while the four requirement failures remain.
