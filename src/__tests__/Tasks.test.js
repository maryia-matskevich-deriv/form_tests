import React from "react";
import '@testing-library/jest-dom';
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ValidationInReact from "../ValidationInReact";

const getFormElements = (screen) => {
  return {
    gender_select: screen.getByRole('combobox'),
    firstNameInput: screen.getByPlaceholderText(/first name/i),
    emailInput: screen.getByPlaceholderText(/email address/i),
    mobileInput: screen.getByPlaceholderText(/mobile/i),
    passwordInput: screen.getByPlaceholderText(/^password$/i),
    confirmPasswordInput: screen.getByPlaceholderText(/confirm password/i),
  }
}

const validFormValues = ['female', 'Alice', 'alice@mail.com', '6969696969', 'Abcd1234', 'Abcd1234'];

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

    const formElementsArray = Object.values(getFormElements(screen)).slice(1);
    const inputValues = validFormValues.slice(1);

    // assigning values to all input elements except the gender dropdown:
    for (let i = 0; i < formElementsArray.length; i++) {
      userEvent.type(formElementsArray[i], inputValues[i]);
    }

    // test:
    const gender_select = screen.getByRole('combobox');
    expect(gender_select).toHaveDisplayValue(/select/i);
    for (let i = 0; i < formElementsArray.length; i++) {
      expect(formElementsArray[i].value).toBe(inputValues[i]);
    }
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
    const formElementsArray = Object.values(getFormElements(screen));
    for (let i = 0; i < formElementsArray.length; i++) {
      userEvent.type(formElementsArray[i], validFormValues[i]);
    }

    // test:
    userEvent.click(submitButton);
    expect(submitButton).not.toBeDisabled();
    expect(screen.queryAllByText(/required/i)).toHaveLength(0);
  });

  it("Check that the field 'Email' should have correct validation, haven't error message", () => {
    render(<ValidationInReact/>);

    const emailInput = screen.getByPlaceholderText(/email address/i);

    // invalid:
    const invalidEmailAddresses = ['lasagna', '@.', 'alice-at-mail.com', 'alice@@mail.com', '@@mail.com', 'alice@mail.commmmmm'];
    for (const email of invalidEmailAddresses) {
      userEvent.type(emailInput, email);
      expect(screen.queryAllByText(/enter a valid email address/i)).toHaveLength(1);
      userEvent.clear(emailInput);
    }

    // valid:
    userEvent.type(emailInput, 'alice@mail.com');
    expect(screen.queryAllByText(/enter a valid email address/i)).toHaveLength(0);
  });

  it("Check that all fields on the first render should be empty", () => {
    render(<ValidationInReact/>);

    const formElementsArray = Object.values(getFormElements(screen));

    expect(formElementsArray[0].value).toBe('select');
    for (let i = 1; i < formElementsArray.length; i++) {
      expect(formElementsArray[i].value).toBe('')
    }
  });
});
