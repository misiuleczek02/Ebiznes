describe('Cypress Kitchen Sink Actions suite', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/actions');
  });

  it('has the correct page title and navigation', () => {
    cy.title().should('contain', 'Cypress.io: Kitchen Sink');
    cy.get('nav.navbar').should('be.visible');
    cy.get('nav.navbar .navbar-brand').should('contain.text', 'cypress.io');
    cy.contains('Commands').should('be.visible');
    cy.location('pathname').should('include', '/commands/actions');
  });

  it('types into the email field and verifies value', () => {
    cy.get('.action-email').should('have.attr', 'placeholder', 'Email');
    cy.get('.action-email').should('have.class', 'form-control');
    cy.get('.action-email').type('test@example.com');
    cy.get('.action-email').should('have.value', 'test@example.com');
  });

  it('types into the disabled textarea using force and verifies text', () => {
    cy.get('.action-disabled').should('be.disabled');
    cy.get('.action-disabled').should('have.attr', 'disabled');
    cy.get('.action-disabled').type('disabled error checking', { force: true });
    cy.get('.action-disabled').should('have.value', 'disabled error checking');
  });

  it('focuses the password field and checks focus styling', () => {
    cy.get('.action-focus').should('have.attr', 'type', 'password');
    cy.get('.action-focus').should('be.visible');
    cy.get('.action-focus').focus();
    cy.get('.action-focus').should('have.class', 'focus');
    cy.get('.action-focus').prev().should('have.attr', 'style', 'color: orange;');
  });

  it('blurs the full-name field and checks error state', () => {
    cy.get('.action-blur').type('About to blur');
    cy.get('.action-blur').should('have.value', 'About to blur');
    cy.get('.action-blur').blur();
    cy.get('.action-blur').should('have.class', 'error');
    cy.get('.action-blur').prev().should('have.attr', 'style', 'color: red;');
  });

  it('clears the description field after typing', () => {
    cy.get('.action-clear').type('Clear this text');
    cy.get('.action-clear').should('have.value', 'Clear this text');
    cy.get('.action-clear').invoke('attr', 'id').should('equal', 'description');
    cy.get('.action-clear').clear();
    cy.get('.action-clear').should('have.value', '');
  });

  it('submits the coupon form and verifies submission message', () => {
    cy.get('.action-form').find('[type="text"]').type('HALFOFF');
    cy.get('.action-form').find('label').should('contain.text', 'Coupon Code');
    cy.get('.action-form button[type="submit"]').should('be.visible').and('contain.text', 'Submit');
    cy.get('.action-form').submit();
    cy.get('.action-form').next().should('contain.text', 'Your form has been submitted!');
  });

  it('checks the click button exists and canvas presence', () => {
    cy.get('.action-btn').should('be.visible').and('contain.text', 'Click to toggle popover');
    cy.get('.action-opacity .btn').should('exist');
    cy.get('#action-canvas').should('be.visible').and('have.attr', 'width', '250');
  });

  it('clicks every action label and verifies count', () => {
    cy.get('.action-labels > .label').should('have.length', 6);
    cy.get('.action-labels > .label').click({ multiple: true });
    cy.get('.action-labels > .label').each(($el) => {
      cy.wrap($el).should('be.visible').and('have.class', 'label-primary');
    });
  });

  it('checks checkboxes and radios with .check()', () => {
    cy.get('.action-checkboxes [type="checkbox"]').not('[disabled]').should('have.length', 2);
    cy.get('.action-checkboxes [type="checkbox"]').not('[disabled]').check();
    cy.get('.action-checkboxes [type="checkbox"]').not('[disabled]').should('be.checked');
    cy.get('.action-radios [type="radio"]').not('[disabled]').check('radio1');
    cy.get('.action-radios [type="radio"]').not('[disabled]').should('be.checked');
  });

  it('unchecks checkboxes and verifies the values are cleared', () => {
    cy.get('.action-check [type="checkbox"]').not('[disabled]').should('have.length', 2);
    cy.get('.action-check [type="checkbox"]').not('[disabled]').uncheck();
    cy.get('.action-check [type="checkbox"]').not('[disabled]').should('not.be.checked');
    cy.get('.action-check [type="checkbox"][value="checkbox1"]').check('checkbox1');
    cy.get('.action-check [type="checkbox"][value="checkbox1"]').should('be.checked');
    cy.get('.action-check [type="checkbox"][value="checkbox1"]').uncheck();
    cy.get('.action-check [type="checkbox"][value="checkbox1"]').should('not.be.checked');
  });

  it('selects a single fruit and verifies the selected value', () => {
    cy.get('.action-select').should('have.value', '--Select a fruit--');
    cy.get('.action-select').select('apples');
    cy.get('.action-select').should('have.value', 'fr-apples');
    cy.get('.action-select').select('fr-bananas');
    cy.get('.action-select').should('have.value', 'fr-bananas');
  });

  it('selects multiple fruits and asserts their values', () => {
    cy.get('.action-select-multiple').select(['apples', 'oranges', 'bananas']);
    cy.get('.action-select-multiple').find('option:selected').should('have.length', 3);
    cy.get('.action-select-multiple').invoke('val').should('deep.equal', ['fr-apples', 'fr-oranges', 'fr-bananas']);
  });

  it('scrolls horizontal container into view and checks visibility', () => {
    cy.get('#scroll-horizontal button').should('not.be.visible');
    cy.get('#scroll-horizontal button').scrollIntoView();
    cy.get('#scroll-horizontal button').should('be.visible');
  });

  it('scrolls vertical container into view and checks visibility', () => {
    cy.get('#scroll-vertical button').should('not.be.visible');
    cy.get('#scroll-vertical button').scrollIntoView();
    cy.get('#scroll-vertical button').should('be.visible');
  });

  it('scrolls both container into view and checks visibility', () => {
    cy.get('#scroll-both button').should('not.be.visible');
    cy.get('#scroll-both button').scrollIntoView();
    cy.get('#scroll-both button').should('be.visible');
  });

  it('scrolls the page and scrollable containers with cy.scrollTo()', () => {
    cy.scrollTo('bottom');
    cy.get('#scrollable-horizontal').should('be.visible').scrollTo('right');
    cy.get('#scrollable-horizontal').find('li').its('length').should('be.gte', 10);
    cy.get('#scrollable-vertical').should('be.visible').scrollTo(250, 250);
    cy.get('#scrollable-both').should('be.visible').scrollTo('75%', '25%');
  });

  it('triggers the range input change and checks the updated display', () => {
    cy.get('.trigger-input-range').should('have.attr', 'type', 'range');
    cy.get('.trigger-input-range').invoke('val', 25).trigger('change');
    cy.get('.trigger-input-range').siblings('p').should('have.text', '25');
  });

  it('double clicks the action div and verifies the hidden input appears', () => {
    cy.get('.action-div').dblclick();
    cy.get('.action-div').should('not.be.visible');
    cy.get('.action-input-hidden').should('be.visible').and('have.attr', 'type', 'text');
  });

  it('right clicks the action div and verifies the hidden input appears', () => {
    cy.get('.rightclick-action-div').rightclick();
    cy.get('.rightclick-action-div').should('not.be.visible');
    cy.get('.rightclick-action-input-hidden').should('be.visible').and('have.attr', 'type', 'text');
  });
});
