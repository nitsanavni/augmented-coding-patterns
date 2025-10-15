---
authors: [ivett_ordog]
---

# Approved Fixtures

## Problem
Generating both tests and code with the AI and not checking is risky, but the AI is also prone to generating lots of tests quickly. Reviewing many AI-generated tests quickly becomes impractical, especially when assertions are complex.

## Pattern
This pattern works best for problems that have an intuitive visual representation that is straightforward to check, but can also be used for checking call sequences. 

Design tests around approval files that combine input and expected output in a domain-specific easy-to-validate format. 

Validate the test execution logic once. After that, adding new test cases only requires reviewing fixtures.

Structure each approval file to contain:
- Input data (context, parameters, state)
- Expected output (results, side effects, API calls)
- Format adapted to your problem domain for easy scanning

The test runner reads fixtures, executes code, and regenerates approval files. Validation becomes a simple diff review.

## Example

**Testing a multi-step process with external service calls:**

Create fixtures like `checkout-with-discount.approved.md`:
```markdown
## Input
User: premium_member
Cart: [laptop: $1200, mouse: $50]
Discount code: SAVE20

## Service Calls
POST /inventory/reserve
  {"items": ["laptop-123", "mouse-456"]}
Response: 200 {"reservation_id": "res_789"}

POST /payment/process
  {"amount": 1000, "discount": 250}
Response: 200 {"transaction_id": "txn_abc"}

## Output
Order: confirmed
Total: $1000
Email sent: order_confirmation
```

Single test reads all `.approved.md` files, executes flows, regenerates files with actual results. Review is scanning markdown diffs, not reading assertion code.

## Note

This pattern has similarities to Gherkin but better adopts to the specific domain, making the extra indirection worthwhile.
