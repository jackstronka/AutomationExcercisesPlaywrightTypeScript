# Test coverage plan – automationexercise.com

This is a “living” plan: we update it when adding or changing tests.

## Navigation (Header)

- [ ] `@smoke` Link “Home” goes to main page
- [ ] `@smoke` Link “Products” goes to product list
- [ ] `@smoke` Link “Cart” goes to cart
- [ ] `@smoke` Link “Signup / Login” goes to auth
- [ ] `@smoke` Link “Contact us” goes to contact form

## Auth (Signup/Login)

- [x] `@auth` New user registration (TC01 Register User)
- [ ] `@auth` Login with valid credentials
- [ ] `@auth` Login with invalid credentials
- [ ] `@auth` Logout

## Products

- [ ] `@regression` Product list visible
- [ ] `@regression` Product search
- [ ] `@regression` Open product detail

## Cart

- [ ] `@cart` Add product to cart
- [ ] `@cart` Change product quantity
- [ ] `@cart` Remove product

## Checkout

- [ ] `@checkout` Place order (logged in)
- [ ] `@checkout` Place order (register during checkout)

## Contact us

- [ ] `@contact` Submit contact form
