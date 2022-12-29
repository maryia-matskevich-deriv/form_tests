import React from "react";
import '@testing-library/jest-dom';
import { screen, render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ValidationInReact from "../ValidationInReact";
import App from '../App';

describe("Tasks", () => {
  it("Select the option and check that option 'male' was selected", async () => {
    render(<ValidationInReact/>);

    // selecting male as gender:
    const gender_select = screen.getByRole('combobox');
    userEvent.selectOptions(gender_select, 'male');

    // test:
    expect(gender_select).toHaveDisplayValue(/male/i);   // using display value since it might not match the html element value, yet that's what the user sees
  });

  it("Check that the user has filled the form except of gender select", async () => {
    render(<ValidationInReact/>);

    // assigning values to all input elements except the gender dropdown:
    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const mobileInput = screen.getByPlaceholderText(/mobile/i);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
    userEvent.type(firstNameInput, 'Alice');
    userEvent.type(emailInput, 'alice@mail.com');
    userEvent.type(mobileInput, '6969696969');
    userEvent.type(passwordInput, 'Abcd1234');
    userEvent.type(confirmPasswordInput, 'Abcd1234');

    // test:
    const gender_select = screen.getByRole('combobox');
    expect(gender_select).toHaveDisplayValue(/select/i);
    expect(firstNameInput.value).toBe('Alice');
    expect(emailInput.value).toBe('alice@mail.com');
    expect(mobileInput.value).toBe('6969696969');
    expect(passwordInput.value).toBe('Abcd1234');
    expect(confirmPasswordInput.value).toBe('Abcd1234');
  });

  it("Check that the field 'First Name' was focused and filled with min 2 letters", () => {
    render(<ValidationInReact/>);

    // set the first name input value;
    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    userEvent.type(firstNameInput, 'Alice');

    // test:
    expect(firstNameInput).toHaveFocus();
    expect(firstNameInput.value).toBe('Alice');
  });

  it("Check that the button submit was clicked", () => {
    render(<ValidationInReact/>);

    // click the submit button:
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    // when the button is clicked with no fields filled, there are 2 consequences:
    //   1: it becomes disabled
    //   2: multiple red labels pop up

    // test:
    expect(submitButton).toBeDisabled();
    expect(screen.getAllByText(/required/i)).toHaveLength(5);
  });

  it("Check that the form has a class", () => {
    render(<ValidationInReact/>);
    expect(screen.getByRole('form')).toHaveClass('contacts_form');
  });

  it("Check that the labels of the form have a content", () => {
    render(<ValidationInReact/>);
    const labels = document.getElementsByTagName('label');
    for (const label of labels) {
      expect(label.innerHTML).not.toBe('');
    }
  });

  it("Check that the user can open a list of the gender and doesn't choose anything", () => {
    render(<ValidationInReact/>);

    const gender_select = screen.getByRole('combobox');
    const gender = gender_select.value;

    userEvent.click(gender_select);
    expect(gender_select.value).toBe(gender);
  });

  it("Check that the user can't to submit until fields will be correct filled", () => {
    render(<ValidationInReact/>);

    // test with no values entered:
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);
    expect(submitButton).toBeDisabled();
    expect(screen.getAllByText(/required/i)).toHaveLength(5);

    // assigning values to all input elements:
    const gender_select = screen.getByRole('combobox');
    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const mobileInput = screen.getByPlaceholderText(/mobile/i);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
    userEvent.type(gender_select, 'female');
    userEvent.type(firstNameInput, 'Alice');
    userEvent.type(emailInput, 'alice@mail.com');
    userEvent.type(mobileInput, '6969696969');
    userEvent.type(passwordInput, 'Abcd1234');
    userEvent.type(confirmPasswordInput, 'Abcd1234');

    // test:
    userEvent.click(submitButton);
    expect(submitButton).not.toBeDisabled();
    expect(screen.queryAllByText(/required/i)).toHaveLength(0);
  });

  it("Check that the field 'Email' should have correct validation, haven't error message", () => {
    render(<ValidationInReact/>);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    userEvent.type(emailInput, 'lasagna');
    expect(screen.queryAllByText(/enter a valid email address/i)).toHaveLength(1);
    userEvent.clear(emailInput);
    userEvent.type(emailInput, '@.');
    expect(screen.queryAllByText(/enter a valid email address/i)).toHaveLength(1);
    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'alice-at-mail.com');
    expect(screen.queryAllByText(/enter a valid email address/i)).toHaveLength(1);
    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'alice@@mail.com');
    expect(screen.queryAllByText(/enter a valid email address/i)).toHaveLength(1);
    userEvent.clear(emailInput);
    userEvent.type(emailInput, '@@mail.com');
    expect(screen.queryAllByText(/enter a valid email address/i)).toHaveLength(1);
    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'alice@mail.commmmmm');
    expect(screen.queryAllByText(/enter a valid email address/i)).toHaveLength(1);
    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'alice@mail.com');
    expect(screen.queryAllByText(/enter a valid email address/i)).toHaveLength(0);
  });

  it("Check that all fields on the first render should be empty", () => {
    render(<ValidationInReact/>);

    const gender_select = screen.getByRole('combobox');
    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const mobileInput = screen.getByPlaceholderText(/mobile/i);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);

    expect(gender_select.value).toBe('select');
    expect(firstNameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(mobileInput.value).toBe('');
    expect(passwordInput.value).toBe('');
    expect(confirmPasswordInput.value).toBe('');
  });
});
