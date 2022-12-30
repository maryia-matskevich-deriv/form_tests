import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ValidationInReact from '../ValidationInReact';

describe('Tasks', () => {
  beforeEach(() => {
    render(<ValidationInReact />);
  });

  it("Select the option and check that option 'male' was selected", async () => {
    await userEvent.selectOptions(screen.getByRole('combobox'), 'male');
    expect(screen.getByRole('option', { name: 'male' }).selected).toBeTruthy();
  });

  it('Check that the user has filled the form except of gender select', async () => {
    // inputs except password
    const inputs = screen.queryAllByRole('textbox');
    // inputs for password and confirm password
    const pswInput = screen.getByPlaceholderText(/^password/i);
    const confirmPswInput = screen.getByPlaceholderText(/confirm password/i);

    // check inputs count except passwords
    expect(inputs.length).toBe(3);
    // set content and check inputs for content
    for (let index = 0; index < inputs.length; index++) {
      const el = inputs[index];
      await userEvent.type(el, 'asd');
      expect(el).not.toHaveDisplayValue();
    }
    // type into pass inputs
    await userEvent.type(pswInput, 'Qwerty_123456');
    await userEvent.type(confirmPswInput, 'Qwerty_123456');

    // check for content
    expect(pswInput).not.toHaveDisplayValue();
    expect(confirmPswInput).not.toHaveDisplayValue();

    // check select
    expect(
      screen.getByRole('option', { name: 'select' }).selected
    ).toBeTruthy();
  });

  it("Check that the field 'First Name' was focused and filled with min 2 letters", async () => {
    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    await userEvent.type(firstNameInput, 'MrX');
    expect(firstNameInput.value.length).toBeGreaterThanOrEqual(2);
    expect(firstNameInput).toHaveFocus();
  });

  it('Check that the button submit was clicked', async () => {
    const btn = screen.getByRole('button', { name: /submit/i });
    expect(btn).toBeEnabled();
    await userEvent.click(btn);
    expect(btn).toBeDisabled();
  });

  it('Check that the form has a class', () => {
    // there are not in jsx role="form" or aria-label="form"
    // and getByRole('form') doesn't work so I've used document.querySelector
    const form = document.querySelector('form');
    expect(form).toHaveClass('contacts_form');
  });

  it('Check that the labels of the form have a content', () => {
    // we need to check for content of labels but can't find labels if we don't know the content
    // so I've used document.querySelectorAll again :)
    const labels = document.querySelectorAll('label');
    expect(labels.length).toBe(6);

    for (let index = 0; index < labels.length; index++) {
      expect(labels[index]).not.toBeEmptyDOMElement();
    }
  });

  it("Check that the user can open a list of the gender and doesn't choose anything", async () => {
    await userEvent.click(screen.getByRole('combobox'));
    expect(
      screen.getByRole('option', { name: 'select' }).selected
    ).toBeTruthy();
  });

  it("Check that the user can't to submit until fields will be correct filled", async () => {
    // expect(true).toBe(true);

    // get all inputs
    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const mobileInput = screen.getByPlaceholderText(/mobile/i);
    const pswInput = screen.getByPlaceholderText(/^password/i);
    const confirmPswInput = screen.getByPlaceholderText(/confirm password/i);

    // type values
    await userEvent.type(firstNameInput, 'Alex');
    // set wrong email
    await userEvent.type(emailInput, 'Alex@m');
    await userEvent.type(mobileInput, '8341242132');
    await userEvent.type(pswInput, 'Qwerty_123456');
    await userEvent.type(confirmPswInput, 'Qwerty_123456');

    // get button
    const btn = screen.getByRole('button', { name: /submit/i });
    expect(btn).toBeDisabled();

    // set right email
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'Alex@m.com');

    expect(btn).toBeEnabled();
  });

  it("Check that the field 'Email' should have correct validation, haven't error message", async () => {
    // expect(true).toBe(true);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    await userEvent.type(emailInput, 'test');
    const emailError = screen.getByText('Enter a valid email address');
    expect(emailError).toBeInTheDocument();

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'asd@m.com');
    expect(emailInput).toHaveDisplayValue('asd@m.com');
    expect(emailError).toBeEmptyDOMElement();
  });

  it('Check that all fields on the first render should be empty', () => {
    // inputs except password
    const inputs = screen.queryAllByRole('textbox');
    // inputs for password and confirm password
    const pswInput = screen.getByPlaceholderText(/^password/i);
    const confirmPswInput = screen.getByPlaceholderText(/confirm password/i);

    // check inputs count except passwords
    expect(inputs.length).toBe(3);
    // check inputs for content
    for (let index = 0; index < inputs.length; index++) {
      const el = inputs[index];
      expect(el).toHaveDisplayValue('');
    }
    // check for content
    expect(pswInput).toHaveDisplayValue('');
    expect(confirmPswInput).toHaveDisplayValue('');
  });
});
